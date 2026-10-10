// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/ProofCanvas.sol";
import "../src/SwarmScoreRegistry.sol";

contract SwarmScoreRegistryTest is Test {
    ProofCanvas internal p;
    SwarmScoreRegistry internal registry;
    address internal constant ALICE = address(0xA11CE);
    address internal constant BOB = address(0xB0B);
    uint256 internal constant ORACLE_PK = 0xBEEF1234;
    bytes32 internal constant WORK = keccak256("real-job-work-id");
    bytes32 internal constant JOB = keccak256("imd-job-001");
    bytes32 internal constant POLICY = keccak256("objectively-verified-four-roles-v1");
    bytes32 internal constant QUESTION = keccak256("canonical-question-committing-all-records");
    bytes32 internal constant TYPEHASH = keccak256("OracleAttestation(bytes32 requestId,uint256 chainId,bytes32 questionHash,uint8 answerType,bytes answer,uint256 figure,uint64 fromBlock,uint64 toBlock,bytes32 blockHash,bytes32 panelJobId,uint16 panelSize,uint16 quorum,uint16 agreed,uint64 issuedAt,uint64 expiresAt)");

    function setUp() public {
        vm.warp(1_700_000_000);
        p = new ProofCanvas(address(this),address(0x789));
        p.setMintOpen(true);
        p.setOracleSigner(vm.addr(ORACLE_PK));
        p.approveOracleQuestion(QUESTION,true);
        vm.prank(ALICE); p.mint(bytes32("agent-a"));
        vm.prank(BOB); p.mint(bytes32("agent-b"));
        registry = new SwarmScoreRegistry(address(p));
    }

    function seats() internal pure returns(bytes32[4] memory ids, bytes32[4] memory records) {
        for(uint256 i;i<4;++i) {
            ids[i] = keccak256(abi.encode("agent-seat",i));
            records[i] = keccak256(abi.encode("accepted-imd-work",i));
        }
    }

    function _signed(IMDOracleV2.Attestation memory a) internal returns(bytes memory) {
        bytes32 domain = keccak256(abi.encode(
            keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
            keccak256("IdentityMD Oracle"),keccak256("2"),block.chainid,address(p)
        ));
        bytes32 h = keccak256(abi.encode(TYPEHASH,a.requestId,a.chainId,a.questionHash,a.answerType,keccak256(a.answer),
            a.figure,a.fromBlock,a.toBlock,a.blockHash,a.panelJobId,a.panelSize,a.quorum,a.agreed,a.issuedAt,a.expiresAt));
        (uint8 v,bytes32 r,bytes32 s) = vm.sign(ORACLE_PK,keccak256(abi.encodePacked("\x19\x01",domain,h)));
        return abi.encodePacked(r,s,v);
    }

    function _attestation() internal view returns(IMDOracleV2.Attestation memory a) {
        a=IMDOracleV2.Attestation({requestId:keccak256("unique-request"),chainId:1,questionHash:QUESTION,answerType:0,
            answer:abi.encode(true),figure:0,fromBlock:200,toBlock:300,blockHash:keccak256("block"),
            panelJobId:keccak256("panel"),panelSize:5,quorum:4,agreed:4,
            issuedAt:uint64(block.timestamp),expiresAt:uint64(block.timestamp+600)});
    }

    function _commit() internal returns(bytes32 root,bytes32 claimId) {
        (bytes32[4] memory ids,bytes32[4] memory records)=seats();
        root=registry.canonicalRoot(1,1,0,JOB,POLICY,ids,records);
        vm.prank(ALICE);
        claimId=p.registerOracleClaim(1,1,WORK,root,keccak256("swarm-score"),QUESTION);
        vm.prank(ALICE);
        registry.commitScore(WORK,JOB,POLICY,QUESTION,1,1,0,ids,records);
    }

    function testFourRolesCommitAndNativeProofFinalize() public {
        (bytes32 root,bytes32 claimId)=_commit();
        vm.warp(block.timestamp+2);
        IMDOracleV2.Attestation memory a=_attestation();
        p.acceptOracleProof(claimId,a,_signed(a));
        registry.finalizeScore(WORK);
        (,,,bytes32 actualRoot,,,,bool finalized)=registry.scores(WORK);
        assertEq(actualRoot,root);
        assertTrue(finalized);
        (,,,,bytes32 req,,uint16 panel,uint16 quorum,uint16 agreed)=p.nativeReceipts(WORK);
        assertEq(req,a.requestId);
        assertEq(uint256(panel),5);
        assertEq(uint256(quorum),4);
        assertEq(uint256(agreed),4);
        vm.expectRevert(SwarmScoreRegistry.InvalidScore.selector);
        registry.finalizeScore(WORK);
    }

    function testCannotFinalizeBeforeNativeOracle() public {
        _commit();
        vm.expectRevert(SwarmScoreRegistry.AttestationMismatch.selector);
        registry.finalizeScore(WORK);
    }

    function testDuplicateAgentSeatsRejected() public {
        (bytes32[4] memory ids,bytes32[4] memory rec)=seats();
        ids[2]=ids[0];
        vm.prank(ALICE);
        vm.expectRevert(SwarmScoreRegistry.InvalidScore.selector);
        registry.commitScore(WORK,JOB,POLICY,QUESTION,1,1,0,ids,rec);
    }

    function testNonOwnerCannotCommitScore() public {
        (bytes32[4] memory ids,bytes32[4] memory rec)=seats();
        vm.prank(BOB);
        vm.expectRevert(SwarmScoreRegistry.NotCollector.selector);
        registry.commitScore(WORK,JOB,POLICY,QUESTION,1,1,0,ids,rec);
    }

    function testScoreCanNotCommitSameJobTwice() public {
        _commit();
        (bytes32[4] memory ids,bytes32[4] memory rec)=seats();
        vm.prank(ALICE);
        vm.expectRevert(SwarmScoreRegistry.AlreadyCommitted.selector);
        registry.commitScore(keccak256("other-work"),JOB,POLICY,QUESTION,1,1,0,ids,rec);
    }

    function testSourceChainMismatchRejected() public {
        (bytes32[4] memory ids,bytes32[4] memory records)=seats();
        bytes32 root=registry.canonicalRoot(2,1,0,JOB,POLICY,ids,records);
        vm.prank(ALICE);
        bytes32 claimId=p.registerOracleClaim(1,1,WORK,root,keccak256("swarm-score"),QUESTION);
        vm.prank(ALICE);
        registry.commitScore(WORK,JOB,POLICY,QUESTION,2,1,0,ids,records);
        vm.warp(block.timestamp+2);
        IMDOracleV2.Attestation memory a=_attestation();
        p.acceptOracleProof(claimId,a,_signed(a));
        vm.expectRevert(SwarmScoreRegistry.AttestationMismatch.selector);
        registry.finalizeScore(WORK);
    }

    function testEvidenceMismatchCannotFinalize() public {
        (,bytes32 claimId)=_commit();
        // A correctly signed IMD result for a separate native receipt cannot
        // be treated as proof for this precommitted score.
        vm.warp(block.timestamp+2);
        IMDOracleV2.Attestation memory a=_attestation();
        p.acceptOracleProof(claimId,a,_signed(a));
        vm.expectRevert(SwarmScoreRegistry.InvalidScore.selector);
        registry.finalizeScore(bytes32(uint256(12345)));
    }
}
