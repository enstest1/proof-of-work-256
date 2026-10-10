// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title SwarmScoreRegistry
/// @notice A precommitted, inspectable manifest for proof-backed swarm creation.
/// @dev A published seat/work list is a CLAIM by the collector. The only
///      native authentication is ProofCanvas's signed oracle receipt, which
///      attests to a question hash, NOT automatically to seat independence.
///      Consumers must inspect the exact approved question and manifest.
interface IProofCanvasScore {
    function ownerOf(uint256 id) external view returns (address);
    function consumedWork(bytes32 workId) external view returns (bool);
    function nativeReceiptSourceChainId(bytes32 workId) external view returns (uint256);
    function nativeReceipts(bytes32 workId) external view returns (
        uint256 canvasA, uint256 canvasB, bytes32 evidenceHash,
        bytes32 questionHash, bytes32 requestId, uint64 issuedAt,
        uint16 panelSize, uint16 quorum, uint16 agreed
    );
}

contract SwarmScoreRegistry {
    IProofCanvasScore public immutable canvas;

    // Each manifest carries exactly four canonical roles, sorted in this order:
    // Architect, Builder, Critic, Adversary. Hashes point to public IMD records.
    struct Score {
        uint256 canvasA;
        uint256 canvasB;
        bytes32 jobId;
        bytes32 manifestRoot;
        bytes32 policyHash;
        bytes32 questionHash;
        uint64 committedAt;
        bool finalized;
    }
    mapping(bytes32 => Score) public scores; // workId => committed score
    mapping(bytes32 => bool) public committedJobs;
    mapping(bytes32 => uint256) public scoreSourceChainId; // job must have exactly one score

    event ScoreCommitted(
        bytes32 indexed workId, bytes32 indexed jobId, uint256 indexed canvasA,
        uint256 canvasB, bytes32 manifestRoot, bytes32 policyHash,
        bytes32 questionHash, bytes32[4] seatIds, bytes32[4] recordHashes
    );
    event ScoreFinalized(
        bytes32 indexed workId, bytes32 indexed oracleRequestId, bytes32 manifestRoot,
        uint16 agreed, uint16 panelSize, uint16 quorum
    );

    error InvalidScore();
    error NotCollector();
    error AlreadyCommitted();
    error AttestationMismatch();

    constructor(address canvasContract) {
        if (canvasContract.code.length == 0) revert InvalidScore();
        canvas = IProofCanvasScore(canvasContract);
    }

    function canonicalRoot(
        uint256 sourceChainId, uint256 canvasA, uint256 canvasB,
        bytes32 jobId, bytes32 policyHash,
        bytes32[4] calldata seatIds, bytes32[4] calldata recordHashes
    ) public view returns (bytes32) {
        return keccak256(abi.encode(
            keccak256('PROOF_SWARM_SCORE_V1'), block.chainid, address(canvas),
            sourceChainId, canvasA, canvasB, jobId, policyHash, seatIds, recordHashes
        ));
    }

    /// @dev Must precede oracle issuance. WorkId must be identical to the
    ///      ProofCanvas registered native workId; evidenceHash MUST equal root.
    ///      For paired art, finalization additionally relies on native two-owner
    ///      confirmation within ProofCanvas.
    function commitScore(
        bytes32 workId, bytes32 jobId, bytes32 policyHash,
        bytes32 questionHash, uint256 sourceChainId,
        uint256 canvasA, uint256 canvasB,
        bytes32[4] calldata seatIds, bytes32[4] calldata recordHashes
    ) external returns (bytes32 root) {
        if (canvas.ownerOf(canvasA) != msg.sender) revert NotCollector();
        if (canvasB != 0 && (canvasB <= canvasA || canvas.ownerOf(canvasB) == msg.sender)) revert InvalidScore();
        if (workId == 0 || jobId == 0 || policyHash == 0 || questionHash == 0 || sourceChainId == 0) revert InvalidScore();
        if (scores[workId].committedAt != 0 || committedJobs[jobId]) revert AlreadyCommitted();
        if (canvas.consumedWork(workId)) revert AlreadyCommitted();
        for (uint256 i; i < 4; ++i) {
            if (seatIds[i] == 0 || recordHashes[i] == 0) revert InvalidScore();
            for (uint256 j; j < i; ++j) {
                if (seatIds[i] == seatIds[j] || recordHashes[i] == recordHashes[j]) revert InvalidScore();
            }
        }
        root = canonicalRoot(sourceChainId, canvasA, canvasB, jobId, policyHash, seatIds, recordHashes);
        scores[workId] = Score(canvasA,canvasB,jobId,root,policyHash,questionHash,uint64(block.timestamp),false);
        scoreSourceChainId[workId] = sourceChainId;
        committedJobs[jobId] = true;
        emit ScoreCommitted(workId,jobId,canvasA,canvasB,root,policyHash,questionHash,seatIds,recordHashes);
    }

    /// @notice Permissionless finalization but ONLY against an already-accepted
    ///         signed native IMD Oracle v2 receipt on the linked ProofCanvas.
    function finalizeScore(bytes32 workId) external {
        Score storage s = scores[workId];
        if (s.committedAt == 0 || s.finalized) revert InvalidScore();
        (
            uint256 a,uint256 b,bytes32 evidence,bytes32 question,bytes32 req,
            uint64 issuedAt,uint16 panel,uint16 quorum,uint16 agreed
        ) = canvas.nativeReceipts(workId);
        if (req == 0 || a != s.canvasA || b != s.canvasB ||
            evidence != s.manifestRoot || question != s.questionHash ||
            issuedAt < s.committedAt || panel == 0 || agreed < quorum ||
            canvas.nativeReceiptSourceChainId(workId) != scoreSourceChainId[workId]
        ) revert AttestationMismatch();
        s.finalized = true;
        emit ScoreFinalized(workId,req,s.manifestRoot,agreed,panel,quorum);
    }
}
