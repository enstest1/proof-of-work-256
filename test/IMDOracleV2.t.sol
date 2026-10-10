// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "forge-std/Test.sol";
import "../src/ProofCanvas.sol";
import "../src/IMDOracleV2.sol";

contract IMDOracleV2Test is Test {
    ProofCanvas p;
    uint256 oraclePrivateKey = 0xBEEF1234;
    address collector = address(0xA11CE);
    bytes32 constant WORK = keccak256("imd-job-1");
    bytes32 constant EVIDENCE = keccak256("artifact-evidence-v1");
    bytes32 constant CATEGORY = keccak256("reproducible-tests");
    bytes32 constant QUESTION = keccak256("EXACT QUESTION WITH EVIDENCE AND CRITERIA");
    bytes32 constant TYPEHASH = keccak256("OracleAttestation(bytes32 requestId,uint256 chainId,bytes32 questionHash,uint8 answerType,bytes answer,uint256 figure,uint64 fromBlock,uint64 toBlock,bytes32 blockHash,bytes32 panelJobId,uint16 panelSize,uint16 quorum,uint16 agreed,uint64 issuedAt,uint64 expiresAt)");

    function setUp() public {
        vm.warp(1_700_000_000);
        p = new ProofCanvas(address(this), address(0x789));
        p.setOracleSigner(vm.addr(oraclePrivateKey));
        p.approveOracleQuestion(QUESTION, true);
        p.setMintOpen(true);
        vm.prank(collector); p.mint(bytes32("agent"));
    }

    function register(bytes32 workId, bytes32 question) internal returns (bytes32) {
        vm.prank(collector);
        return p.registerOracleClaim(1, 1, workId, EVIDENCE, CATEGORY, question);
    }
    function attestation(bytes32 requestId, bytes32 question) internal view returns (IMDOracleV2.Attestation memory a) {
        a = IMDOracleV2.Attestation({
            requestId: requestId, chainId: 1, questionHash: question, answerType: 0,
            answer: abi.encode(true), figure: 0, fromBlock: 2100, toBlock: 2200,
            blockHash: keccak256("block"), panelJobId: keccak256("panel"),
            panelSize: 5, quorum: 4, agreed: 4,
            issuedAt: uint64(block.timestamp), expiresAt: uint64(block.timestamp + 3600)
        });
    }
    function sign(IMDOracleV2.Attestation memory a, uint256 key) internal returns (bytes memory) {
        bytes32 domain = keccak256(abi.encode(
            keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
            keccak256("IdentityMD Oracle"), keccak256("2"), block.chainid, address(p)
        ));
        bytes32 structHash = keccak256(abi.encode(
            TYPEHASH, a.requestId, a.chainId, a.questionHash, a.answerType, keccak256(a.answer), a.figure,
            a.fromBlock, a.toBlock, a.blockHash, a.panelJobId, a.panelSize, a.quorum, a.agreed,
            a.issuedAt, a.expiresAt
        ));
        bytes32 digest = keccak256(abi.encodePacked("\x19\x01", domain, structHash));
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(key, digest);
        return abi.encodePacked(r,s,v);
    }

    function testValidOracleProofEvolvesCanvas() public {
        bytes32 claim = register(WORK, QUESTION);
        IMDOracleV2.Attestation memory a = attestation(bytes32(uint256(13)), QUESTION);
        bytes memory sig = sign(a, oraclePrivateKey);
        p.acceptOracleProof(claim, a, sig);
        (,,uint64 proofs,,,,) = p.canvas(1);
        assertEq(proofs, 1);
        assertEq(p.consumedWork(WORK), true);
        assertEq(p.consumedOracleRequests(a.requestId), true);
    }
    function testWrongSignerRejected() public {
        bytes32 claim = register(WORK, QUESTION);
        IMDOracleV2.Attestation memory a = attestation(bytes32(uint256(13)), QUESTION);
        vm.expectRevert(ProofCanvas.OracleSignatureInvalid.selector);
        p.acceptOracleProof(claim, a, sign(a, 0xBAD));
    }
    function testDifferentQuestionRejected() public {
        bytes32 claim = register(WORK, QUESTION);
        IMDOracleV2.Attestation memory a = attestation(bytes32(uint256(13)), keccak256("different"));
        vm.expectRevert(ProofCanvas.OracleClaimInvalid.selector);
        p.acceptOracleProof(claim, a, sign(a, oraclePrivateKey));
    }
    function testOracleFalseAnswerRejected() public {
        bytes32 claim = register(WORK, QUESTION);
        IMDOracleV2.Attestation memory a = attestation(bytes32(uint256(13)), QUESTION);
        a.answer = abi.encode(false);
        vm.expectRevert(ProofCanvas.OracleClaimInvalid.selector);
        p.acceptOracleProof(claim, a, sign(a, oraclePrivateKey));
    }
    function testInsufficientQuorumRejected() public {
        bytes32 claim = register(WORK, QUESTION);
        IMDOracleV2.Attestation memory a = attestation(bytes32(uint256(13)), QUESTION);
        a.agreed = 3;
        vm.expectRevert(ProofCanvas.OracleClaimInvalid.selector);
        p.acceptOracleProof(claim, a, sign(a, oraclePrivateKey));
    }
    function testOracleIssuedBeforeCommitRejected() public {
        IMDOracleV2.Attestation memory a = attestation(bytes32(uint256(13)), QUESTION);
        vm.warp(block.timestamp + 10);
        bytes32 claim = register(WORK, QUESTION);
        vm.expectRevert(ProofCanvas.OracleClaimInvalid.selector);
        p.acceptOracleProof(claim, a, sign(a, oraclePrivateKey));
    }
    function testExpiredProofRejected() public {
        bytes32 claim = register(WORK, QUESTION);
        IMDOracleV2.Attestation memory a = attestation(bytes32(uint256(13)), QUESTION);
        vm.warp(block.timestamp + 3601);
        vm.expectRevert(ProofCanvas.OracleClaimInvalid.selector);
        p.acceptOracleProof(claim, a, sign(a, oraclePrivateKey));
    }
    function testReplayRejected() public {
        bytes32 claim = register(WORK, QUESTION);
        IMDOracleV2.Attestation memory a = attestation(bytes32(uint256(13)), QUESTION);
        bytes memory sig = sign(a, oraclePrivateKey);
        p.acceptOracleProof(claim, a, sig);
        vm.expectRevert(ProofCanvas.OracleClaimInvalid.selector);
        p.acceptOracleProof(claim, a, sig);
    }
    function testTwoOwnerOracleCollaboration() public {
        address second = address(0xB0B);
        vm.prank(second); p.mint(0);
        bytes32 jointWork = keccak256("joint-job");
        bytes32 jointEvidence = keccak256("joint-artifacts");
        vm.prank(collector);
        bytes32 collaborationId = p.requestOracleCollaboration(1,2,1,jointWork,jointEvidence,QUESTION);
        vm.prank(second); p.confirmOracleCollaboration(collaborationId);
        IMDOracleV2.Attestation memory a = attestation(bytes32(uint256(24)), QUESTION);
        p.acceptOracleCollaboration(collaborationId,a,sign(a,oraclePrivateKey));
        assertTrue(p.collaborating(1,2));
        assertTrue(p.collaborating(2,1));
        vm.expectRevert(ProofCanvas.OracleClaimInvalid.selector);
        p.acceptOracleCollaboration(collaborationId,a,sign(a,oraclePrivateKey));
    }
    function testSecondOwnerMustConfirm() public {
        address second = address(0xB0B);
        vm.prank(second); p.mint(0);
        vm.prank(collector);
        bytes32 collaborationId = p.requestOracleCollaboration(1,2,1,WORK,EVIDENCE,QUESTION);
        IMDOracleV2.Attestation memory a = attestation(bytes32(uint256(24)), QUESTION);
        vm.expectRevert(ProofCanvas.OracleClaimInvalid.selector);
        p.acceptOracleCollaboration(collaborationId,a,sign(a,oraclePrivateKey));
    }
    function testTransferInvalidatesPendingProof() public {
        bytes32 claim = register(WORK, QUESTION);
        IMDOracleV2.Attestation memory a = attestation(bytes32(uint256(32)), QUESTION);
        vm.prank(collector); p.transferFrom(collector, address(0xBA5E), 1);
        vm.expectRevert(ProofCanvas.OracleClaimInvalid.selector);
        p.acceptOracleProof(claim,a,sign(a,oraclePrivateKey));
    }
    function testTransferInvalidatesPendingCollaboration() public {
        address second = address(0xB0B);
        vm.prank(second); p.mint(0);
        vm.prank(collector);
        bytes32 claim = p.requestOracleCollaboration(1,2,1,WORK,EVIDENCE,QUESTION);
        vm.prank(second); p.confirmOracleCollaboration(claim);
        IMDOracleV2.Attestation memory a = attestation(bytes32(uint256(24)),QUESTION);
        vm.prank(second); p.transferFrom(second, address(0xCAFE),2);
        vm.expectRevert(ProofCanvas.OracleClaimInvalid.selector);
        p.acceptOracleCollaboration(claim,a,sign(a,oraclePrivateKey));
    }
    function testLegacyAttestorDisabledByDefault() public {
        uint64 expiry = uint64(block.timestamp + 100);
        vm.expectRevert(ProofCanvas.LegacyDisabled.selector);
        p.acceptProof(1, WORK, EVIDENCE, CATEGORY, expiry, 1, "");
    }
}
