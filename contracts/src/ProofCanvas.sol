// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable2Step} from "@openzeppelin/contracts/access/Ownable2Step.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {Base64} from "@openzeppelin/contracts/utils/Base64.sol";
import {IMDOracleV2} from "./IMDOracleV2.sol";

/// @notice Art collectible, NOT a transferable agent identity or claim to an agent's reputation.
/// @dev An authorized attestor signs each exact evidence claim; signer trust is explicit.
contract ProofCanvas is ERC721, Ownable2Step {
    using Strings for uint256;

    uint256 public constant MAX_GENESIS = 256;
    uint256 public constant MAX_MONUMENTS = 16;
    uint256 public constant MAX_RENDER_NODES = 48;
    bytes32 public constant PROOF_TYPEHASH = keccak256(
        "Proof(uint256 canvasId,bytes32 workId,bytes32 evidenceHash,bytes32 category,uint64 expiresAt,uint256 nonce)"
    );
    bytes32 public immutable DOMAIN_SEPARATOR;
    address public attestor; // legacy project-controlled bridge, NOT the IMD oracle
    address public oracleSigner; // IMD oracle attester, separately pinned at launch
    bool public legacyProofsEnabled; // intentionally false by default
    bool public legacyProofsSealed; // irreversible shutdown for production
    mapping(bytes32 => bool) public approvedOracleQuestions; // explicit curator policy, not trustless quality verification
    uint256 public genesisMinted;
    uint256 public monumentMinted;
    uint256 public nextId = 1;
    bool public mintOpen;

    struct Canvas {
        bytes32 dna;
        bytes32 history;
        uint64 proofs;
        uint64 lastUpdate;
        bool frozen;
        bool monument;
        uint8 archetype;
    }
    mapping(uint256 => Canvas) public canvas;
    mapping(bytes32 => bool) public consumedWork;
    mapping(uint256 => mapping(uint256 => bool)) public collaborating;
    mapping(uint256 => uint256[4]) public monumentParents;
    // Incremented on every ownership change; makes round-trip transfers invalidate pending authorization.
    mapping(uint256 => uint64) public ownershipEpoch;
    mapping(uint256 => bool) public archived;
    mapping(uint256 => bytes32) public agentKey; // attribution only, not identity verification
    mapping(uint256 => bytes32) public frozenSnapshot;
    struct PendingOracleClaim {
        uint256 canvasId;
        uint256 sourceChainId;
        bytes32 workId;
        bytes32 evidenceHash;
        bytes32 category;
        bytes32 questionHash;
        uint64 registeredAt;
        address collectorAtCommit;
        uint64 ownershipEpochAtCommit;
        bool used;
    }
    mapping(bytes32 => PendingOracleClaim) public pendingOracleClaims;
    mapping(bytes32 => bool) public consumedOracleRequests;
    struct PendingCollaboration {
        uint256 a;
        uint256 b;
        uint256 sourceChainId;
        bytes32 workId;
        bytes32 evidenceHash;
        bytes32 questionHash;
        uint64 confirmedAt;
        address ownerA;
        address ownerB;
        uint64 epochAAtRequest;
        uint64 epochBAtConfirm;
        bool used;
    }
    mapping(bytes32 => PendingCollaboration) public pendingCollaborations;
    uint16 public minPanelSize = 5;
    uint16 public minQuorum = 4;
    mapping(address => uint256) public mintCounts;

    event WorkAccepted(uint256 indexed canvasId, bytes32 indexed workId, bytes32 evidenceHash, bytes32 category, bytes32 newHistory);
    event Collaboration(uint256 indexed a, uint256 indexed b, bytes32 indexed workId);
    event Frozen(uint256 indexed canvasId, bytes32 immutableHistory);
    event MonumentCreated(uint256 indexed monumentId, uint256[4] parents);
    event MetadataUpdate(uint256 indexed _tokenId); // ERC-4906
    event AttestorChanged(address indexed prior, address indexed next);
    event MintStatusChanged(bool enabled);
    event OracleSignerChanged(address indexed previousSigner, address indexed newSigner);
    event OracleClaimRegistered(bytes32 indexed claimId, uint256 indexed canvasId, bytes32 indexed workId, bytes32 questionHash);
    event OracleReceiptVerified(bytes32 indexed claimId, bytes32 indexed oracleRequestId, uint16 agreed, uint16 quorum);
    event CollaborationRequested(bytes32 indexed claimId, uint256 indexed a, uint256 indexed b);
    event CollaborationConfirmed(bytes32 indexed claimId);
    event LegacyProofsEnabled(bool enabled);
    event LegacyProofsPermanentlySealed();
    event OracleQuestionApproval(bytes32 indexed questionHash, bool approved);

    error NotTokenOwner();
    error MintClosed();
    error MintCap();
    error BadInput();
    error InvalidProof();
    error UsedWork();
    error ArchivedOrFrozen();
    error TokenMissing();
    error OracleClaimInvalid();
    error OracleSignatureInvalid();
    error LegacyDisabled();
    error OracleQuestionNotApproved();

    constructor(address initialOwner, address initialAttestor) ERC721("PROOF//OF//WORK: THE 256", "PROOF") Ownable(initialOwner) {
        if (initialAttestor == address(0)) revert BadInput();
        attestor = initialAttestor;
        DOMAIN_SEPARATOR = keccak256(abi.encode(
            keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
            keccak256(bytes("ProofCanvas")), keccak256(bytes("1")), block.chainid, address(this)
        ));
    }

    function setAttestor(address next) external onlyOwner {
        if (next == address(0)) revert BadInput();
        emit AttestorChanged(attestor, next);
        attestor = next;
    }

    function setOracleSigner(address next) external onlyOwner {
        if (next == address(0)) revert BadInput();
        emit OracleSignerChanged(oracleSigner, next);
        oracleSigner = next;
    }

    // Legacy attestations must be explicitly enabled, and must never be labelled IMD-verified.
    function setLegacyProofsEnabled(bool enabled) external onlyOwner {
        if (legacyProofsSealed) revert LegacyDisabled();
        legacyProofsEnabled = enabled;
        emit LegacyProofsEnabled(enabled);
    }

    /// @notice Seal the legacy bridge irreversibly before a public release.
    function sealLegacyProofs() external onlyOwner {
        if (legacyProofsSealed) revert LegacyDisabled();
        legacyProofsEnabled = false;
        legacyProofsSealed = true;
        emit LegacyProofsPermanentlySealed();
    }

    /// @notice Curator-approved question hashes; authorization is explicitly trusted, not permissionless.
    function approveOracleQuestion(bytes32 questionHash, bool approved) external onlyOwner {
        if (questionHash == bytes32(0)) revert BadInput();
        approvedOracleQuestions[questionHash] = approved;
        emit OracleQuestionApproval(questionHash, approved);
    }

    function setMintOpen(bool enabled) external onlyOwner {
        mintOpen = enabled;
        emit MintStatusChanged(enabled);
    }

    /// @notice Public free mint, max one Genesis per wallet; no team-reserved rarity.
    /// @dev DNA is deterministic, NOT unbiased randomness. Genesis images reveal at mint.
    function mint(bytes32 identityKey) external returns (uint256 id) {
        if (!mintOpen) revert MintClosed();
        if (genesisMinted >= MAX_GENESIS || mintCounts[msg.sender] > 0) revert MintCap();
        id = nextId++;
        ++genesisMinted;
        ++mintCounts[msg.sender];
        agentKey[id] = identityKey;
        canvas[id] = Canvas({
            dna: keccak256(abi.encodePacked("PROOF_GENESIS_V1", block.chainid, address(this), id)),
            history: bytes32(0), proofs: 0, lastUpdate: uint64(block.timestamp),
            frozen: false, monument: false, archetype: uint8((id - 1) % 4)
        });
        _safeMint(msg.sender, id);
        emit MetadataUpdate(id);
    }

    /// @notice Exactly one signature per workId, bound to canvas, chain, and contract.
    /// @dev Attestor must independently verify upstream work evidence and IMD eligibility.
    function acceptProof(
        uint256 id, bytes32 workId, bytes32 evidenceHash, bytes32 category,
        uint64 expiresAt, uint256 nonce, bytes calldata signature
    ) external {
        if (!legacyProofsEnabled) revert LegacyDisabled();
        _assertActive(id);
        if (workId == bytes32(0) || evidenceHash == bytes32(0) || category == bytes32(0) || expiresAt < block.timestamp) revert BadInput();
        if (consumedWork[workId]) revert UsedWork();
        bytes32 structHash = keccak256(abi.encode(PROOF_TYPEHASH, id, workId, evidenceHash, category, expiresAt, nonce));
        bytes32 digest = keccak256(abi.encodePacked("\x19\x01", DOMAIN_SEPARATOR, structHash));
        if (ECDSA.recover(digest, signature) != attestor) revert InvalidProof();
        _applyWork(id, workId, evidenceHash, category, nonce);
    }

    function _applyWork(uint256 id, bytes32 workId, bytes32 evidenceHash, bytes32 category, uint256 nonce) internal {
        consumedWork[workId] = true;
        Canvas storage c = canvas[id];
        c.history = keccak256(abi.encode(c.history, workId, evidenceHash, category, nonce));
        ++c.proofs;
        c.lastUpdate = uint64(block.timestamp);
        emit WorkAccepted(id, workId, evidenceHash, category, c.history);
        emit MetadataUpdate(id);
    }

    /// @notice Commit a specific work claim *before* the IMD Oracle attestation is issued.
    /// @dev The caller is responsible for making the question objectively checkable.
    function registerOracleClaim(
        uint256 id, uint256 sourceChainId, bytes32 workId, bytes32 evidenceHash,
        bytes32 category, bytes32 questionHash
    ) external returns (bytes32 claimId) {
        if (ownerOf(id) != msg.sender) revert NotTokenOwner();
        _assertActive(id);
        if (sourceChainId == 0 || workId == 0 || evidenceHash == 0 || category == 0 || questionHash == 0 || consumedWork[workId]) revert BadInput();
        if (!approvedOracleQuestions[questionHash]) revert OracleQuestionNotApproved();
        claimId = keccak256(abi.encode("PROOF_ORACLE_CLAIM_V1", block.chainid, address(this), id, sourceChainId, workId, evidenceHash, category, questionHash));
        if (pendingOracleClaims[claimId].registeredAt != 0) revert BadInput();
        pendingOracleClaims[claimId] = PendingOracleClaim(id, sourceChainId, workId, evidenceHash, category, questionHash, uint64(block.timestamp), msg.sender, ownershipEpoch[id], false);
        emit OracleClaimRegistered(claimId, id, workId, questionHash);
    }

    /// @notice Verify native IMD OracleAttestation v2 against this exact consumer contract.
    /// @dev `questionHash` is only accepted if the claim was registered before `issuedAt`.
    /// True is necessary, not sufficient, to establish meaningful work: inspect evidence.
    function acceptOracleProof(bytes32 claimId, IMDOracleV2.Attestation calldata a, bytes calldata signature) external {
        PendingOracleClaim storage claim = pendingOracleClaims[claimId];
        if (claim.registeredAt == 0 || claim.used || consumedOracleRequests[a.requestId]) revert OracleClaimInvalid();
        if (!approvedOracleQuestions[claim.questionHash]) revert OracleQuestionNotApproved();
        _assertActive(claim.canvasId);
        if (ownerOf(claim.canvasId) != claim.collectorAtCommit || ownershipEpoch[claim.canvasId] != claim.ownershipEpochAtCommit) revert OracleClaimInvalid();
        if (oracleSigner == address(0) || a.requestId == 0 || a.questionHash != claim.questionHash || a.chainId != claim.sourceChainId) revert OracleClaimInvalid();
        if (a.answerType != 0 || a.answer.length != 32 || !abi.decode(a.answer, (bool))) revert OracleClaimInvalid();
        if (a.panelSize < minPanelSize || a.quorum < minQuorum || a.quorum > a.panelSize || a.agreed < a.quorum || a.agreed > a.panelSize) revert OracleClaimInvalid();
        if (a.issuedAt < claim.registeredAt || a.issuedAt > block.timestamp || a.expiresAt < block.timestamp || a.expiresAt < a.issuedAt) revert OracleClaimInvalid();
        if (consumedWork[claim.workId]) revert UsedWork();
        if (IMDOracleV2.recover(a, signature) != oracleSigner) revert OracleSignatureInvalid();
        claim.used = true;
        consumedOracleRequests[a.requestId] = true;
        _applyWork(claim.canvasId, claim.workId, claim.evidenceHash, claim.category, uint256(a.requestId));
        emit OracleReceiptVerified(claimId, a.requestId, a.agreed, a.quorum);
    }

    /// @notice First token owner proposes an evidence-backed joint task.
    /// @dev A second token owner must explicitly consent before the oracle signs.
    function requestOracleCollaboration(
        uint256 a, uint256 b, uint256 sourceChainId, bytes32 workId,
        bytes32 evidenceHash, bytes32 questionHash
    ) external returns (bytes32 claimId) {
        if (a == 0 || a >= b || ownerOf(a) != msg.sender || ownerOf(b) == msg.sender) revert BadInput();
        _assertActive(a); _assertActive(b);
        if (sourceChainId == 0 || workId == 0 || evidenceHash == 0 || questionHash == 0 || consumedWork[workId]) revert BadInput();
        if (!approvedOracleQuestions[questionHash]) revert OracleQuestionNotApproved();
        claimId = keccak256(abi.encode("PROOF_COLLAB_V1", block.chainid, address(this), a, b, sourceChainId, workId, evidenceHash, questionHash));
        if (pendingCollaborations[claimId].a != 0) revert BadInput();
        pendingCollaborations[claimId] = PendingCollaboration(a,b,sourceChainId,workId,evidenceHash,questionHash,0,msg.sender,address(0),ownershipEpoch[a],0,false);
        emit CollaborationRequested(claimId,a,b);
    }

    function confirmOracleCollaboration(bytes32 claimId) external {
        PendingCollaboration storage c = pendingCollaborations[claimId];
        if (c.a == 0 || ownerOf(c.b) != msg.sender || c.confirmedAt != 0 || c.used) revert BadInput();
        _assertActive(c.a); _assertActive(c.b);
        if (ownerOf(c.a) != c.ownerA || ownershipEpoch[c.a] != c.epochAAtRequest) revert OracleClaimInvalid();
        c.confirmedAt = uint64(block.timestamp);
        c.ownerB = msg.sender;
        c.epochBAtConfirm = ownershipEpoch[c.b];
        emit CollaborationConfirmed(claimId);
    }

    function acceptOracleCollaboration(bytes32 claimId, IMDOracleV2.Attestation calldata a, bytes calldata signature) external {
        PendingCollaboration storage c = pendingCollaborations[claimId];
        if (c.a == 0 || c.used || c.confirmedAt == 0 || consumedWork[c.workId] || consumedOracleRequests[a.requestId]) revert OracleClaimInvalid();
        if (!approvedOracleQuestions[c.questionHash]) revert OracleQuestionNotApproved();
        _assertActive(c.a); _assertActive(c.b);
        if (ownerOf(c.a) != c.ownerA || ownerOf(c.b) != c.ownerB ||
            ownershipEpoch[c.a] != c.epochAAtRequest || ownershipEpoch[c.b] != c.epochBAtConfirm) revert OracleClaimInvalid();
        if (a.requestId == 0 || a.questionHash != c.questionHash || a.chainId != c.sourceChainId ||
            a.issuedAt < c.confirmedAt || a.issuedAt > block.timestamp || a.expiresAt < block.timestamp || a.expiresAt < a.issuedAt ||
            a.answerType != 0 || a.answer.length != 32 || !abi.decode(a.answer, (bool)) ||
            a.panelSize < minPanelSize || a.quorum < minQuorum || a.quorum > a.panelSize || a.agreed < a.quorum || a.agreed > a.panelSize) revert OracleClaimInvalid();
        if (oracleSigner == address(0) || IMDOracleV2.recover(a,signature) != oracleSigner) revert OracleSignatureInvalid();
        c.used = true;
        consumedWork[c.workId] = true;
        consumedOracleRequests[a.requestId] = true;
        collaborating[c.a][c.b] = true;
        collaborating[c.b][c.a] = true;
        canvas[c.a].history = keccak256(abi.encode(canvas[c.a].history, "IMD_COLLAB_V2", c.workId, c.evidenceHash, c.b));
        canvas[c.b].history = keccak256(abi.encode(canvas[c.b].history, "IMD_COLLAB_V2", c.workId, c.evidenceHash, c.a));
        canvas[c.a].lastUpdate = uint64(block.timestamp);
        canvas[c.b].lastUpdate = uint64(block.timestamp);
        emit Collaboration(c.a,c.b,c.workId);
        emit OracleReceiptVerified(claimId,a.requestId,a.agreed,a.quorum);
        emit MetadataUpdate(c.a);
        emit MetadataUpdate(c.b);
    }

    /// @notice Legacy collaboration requires a project-controlled bridge signature. in a single
    /// independently checked job; offchain verifier must establish both roles.
    function acceptCollaboration(
        uint256 a, uint256 b, bytes32 workId, uint64 expiresAt, bytes calldata signature
    ) external {
        if (!legacyProofsEnabled) revert LegacyDisabled();
        if (a == b || a == 0 || b == 0 || a > b || expiresAt < block.timestamp || workId == bytes32(0)) revert BadInput();
        _assertActive(a); _assertActive(b);
        if (consumedWork[workId]) revert UsedWork();
        bytes32 structHash = keccak256(abi.encode(
            keccak256("Collaboration(uint256 canvasA,uint256 canvasB,bytes32 workId,uint64 expiresAt)"),
            a, b, workId, expiresAt
        ));
        bytes32 digest = keccak256(abi.encodePacked("\x19\x01", DOMAIN_SEPARATOR, structHash));
        if (ECDSA.recover(digest, signature) != attestor) revert InvalidProof();
        consumedWork[workId] = true;
        collaborating[a][b] = true;
        collaborating[b][a] = true;
        canvas[a].history = keccak256(abi.encode(canvas[a].history, "COLLAB", workId, b));
        canvas[b].history = keccak256(abi.encode(canvas[b].history, "COLLAB", workId, a));
        canvas[a].lastUpdate = uint64(block.timestamp);
        canvas[b].lastUpdate = uint64(block.timestamp);
        emit Collaboration(a, b, workId);
        emit MetadataUpdate(a); emit MetadataUpdate(b);
    }

    function freeze(uint256 id) external {
        if (ownerOf(id) != msg.sender) revert NotTokenOwner();
        _assertActive(id);
        canvas[id].frozen = true;
        frozenSnapshot[id] = stateHash(id);
        emit Frozen(id, frozenSnapshot[id]);
        emit MetadataUpdate(id);
    }

    /// @notice Monument is a locked provenance vault; four distinct archetypes,
    /// each with >= 1 signed proof, plus all 6 verified collaboration edges.
    function createMonument(uint256[4] calldata ids) external returns (uint256 id) {
        if (monumentMinted >= MAX_MONUMENTS) revert MintCap();
        bool[4] memory seen;
        bytes32 combined;
        for (uint256 i; i < 4; ++i) {
            uint256 parent = ids[i];
            if (ownerOf(parent) != msg.sender) revert NotTokenOwner();
            _assertActive(parent);
            Canvas memory c = canvas[parent];
            if (c.monument || c.proofs == 0 || seen[c.archetype]) revert BadInput();
            seen[c.archetype] = true;
            combined = keccak256(abi.encode(combined, parent, stateHash(parent)));
            for (uint256 j; j < i; ++j) {
                if (!collaborating[parent][ids[j]]) revert BadInput();
            }
        }
        for (uint256 i; i < 4; ++i) archived[ids[i]] = true;
        id = nextId++;
        ++monumentMinted;
        monumentParents[id] = ids;
        canvas[id] = Canvas(combined, combined, 0, uint64(block.timestamp), true, true, 4);
        _safeMint(msg.sender, id);
        emit MonumentCreated(id, ids);
        emit MetadataUpdate(id);
    }

    function stateHash(uint256 id) public view returns (bytes32) {
        _requireOwned(id);
        Canvas memory c = canvas[id];
        return keccak256(abi.encode(c.dna, c.history, c.proofs, c.archetype, c.monument));
    }

    function _assertActive(uint256 id) internal view {
        if (_ownerOf(id) == address(0)) revert TokenMissing();
        if (canvas[id].frozen || archived[id]) revert ArchivedOrFrozen();
    }

    /// @notice SVG is self-contained onchain and intentionally complexity bounded.
    function svgOf(uint256 id) public view returns (string memory) {
        _requireOwned(id);
        Canvas memory c = canvas[id];
        bytes memory art = abi.encodePacked(
            '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">',
            '<rect width="800" height="800" fill="#0b0c10"/>',
            '<circle cx="400" cy="400" r="220" stroke="#575d69" stroke-width="1" fill="none"/>',
            '<circle cx="400" cy="400" r="12" fill="#e6d0a2"/>'
        );
        uint256 count = 8 + uint256(c.proofs) * 2;
        if (count > MAX_RENDER_NODES) count = MAX_RENDER_NODES;
        for (uint256 i; i < count; ++i) {
            uint256 h = uint256(keccak256(abi.encode(c.dna, c.history, i)));
            uint256 x = 85 + (h % 631);
            uint256 y = 85 + ((h >> 32) % 631);
            string memory ink = i % 4 == 0 ? "#e4c48b" : "#9baad1";
            art = abi.encodePacked(art,
                '<line x1="400" y1="400" x2="', x.toString(), '" y2="', y.toString(),
                '" stroke="', ink, '" stroke-width="1.5" opacity=".65"/>',
                '<circle cx="', x.toString(), '" cy="', y.toString(),
                '" r="', (2 + h % 5).toString(), '" fill="', ink, '"/>'
            );
        }
        return string(abi.encodePacked(art, '</svg>'));
    }

    function tokenURI(uint256 id) public view override returns (string memory) {
        _requireOwned(id);
        Canvas memory c = canvas[id];
        string memory name = c.monument ? string.concat("Monument #", id.toString()) : string.concat("Genesis #", id.toString());
        bytes memory json = abi.encodePacked(
            '{"name":"', name,
            '","description":"An evolving record of attested work. Verification quality depends on the attestor policy.",',
            '"image":"data:image/svg+xml;base64,', Base64.encode(bytes(svgOf(id))),
            '","attributes":[{"trait_type":"Proofs","value":', uint256(c.proofs).toString(),
            '},{"trait_type":"Archetype","value":', uint256(c.archetype).toString(),
            '},{"trait_type":"Monument","value":"', c.monument ? 'true' : 'false', '"}]}'
        );
        return string.concat('data:application/json;base64,', Base64.encode(json));
    }

    /// @dev Archived parents are nontransferable but remain owned and inspectable.
    function _update(address to, uint256 tokenId, address auth) internal override returns (address) {
        if (archived[tokenId] && to != address(0)) revert ArchivedOrFrozen();
        address previousOwner = super._update(to, tokenId, auth);
        if (previousOwner != address(0) && previousOwner != to) {
            ++ownershipEpoch[tokenId];
        }
        return previousOwner;
    }
}
