// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "forge-std/Test.sol";
import "../src/ProofCanvas.sol";
import "../src/IMDOracleV2.sol";

contract AdversarialTest is Test {
    ProofCanvas internal p;
    address internal alice = address(0xA11CE);
    address internal bob = address(0xB0B);
    uint256 internal signerKey = 0x123ABC;
    bytes32 internal constant WORK = keccak256("work-one");
    bytes32 internal constant QUESTION = keccak256("question-one");
    bytes32 internal constant EVIDENCE = keccak256("evidence-one");
    bytes32 internal constant CATEGORY = keccak256("test-run");

    function setUp() public {
        vm.warp(1_700_000_000);
        p = new ProofCanvas(address(this), address(0xABC));
        p.setOracleSigner(vm.addr(signerKey));
        p.approveOracleQuestion(QUESTION, true);
        p.setMintOpen(true);
        vm.prank(alice); p.mint(bytes32("alice-agent"));
    }

    function _attest(bytes32 requestId) internal view returns (IMDOracleV2.Attestation memory a) {
        a = IMDOracleV2.Attestation({
            requestId: requestId, chainId: 1, questionHash: QUESTION, answerType: 0,
            answer: abi.encode(true), figure: 0, fromBlock: 0, toBlock: 0,
            blockHash: bytes32(0), panelJobId: bytes32(uint256(1)), panelSize: 5,
            quorum: 4, agreed: 4, issuedAt: uint64(block.timestamp),
            expiresAt: uint64(block.timestamp + 1 days)
        });
    }
    function _sign(IMDOracleV2.Attestation memory a) internal returns (bytes memory) {
        bytes32 domain = keccak256(abi.encode(
            keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
            keccak256("IdentityMD Oracle"), keccak256("2"), block.chainid, address(p)
        ));
        bytes32 typehash = keccak256("OracleAttestation(bytes32 requestId,uint256 chainId,bytes32 questionHash,uint8 answerType,bytes answer,uint256 figure,uint64 fromBlock,uint64 toBlock,bytes32 blockHash,bytes32 panelJobId,uint16 panelSize,uint16 quorum,uint16 agreed,uint64 issuedAt,uint64 expiresAt)");
        bytes32 digest = keccak256(abi.encodePacked("\x19\x01", domain, keccak256(abi.encode(
            typehash, a.requestId, a.chainId, a.questionHash, a.answerType, keccak256(a.answer),
            a.figure, a.fromBlock, a.toBlock, a.blockHash, a.panelJobId, a.panelSize,
            a.quorum, a.agreed, a.issuedAt, a.expiresAt
        ))));
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(signerKey, digest);
        return abi.encodePacked(r, s, v);
    }
    function _register() internal returns (bytes32) {
        vm.prank(alice);
        return p.registerOracleClaim(1, 1, WORK, EVIDENCE, CATEGORY, QUESTION);
    }
    function testMintIsClosedByDefault() public {
        ProofCanvas fresh = new ProofCanvas(address(this), address(1));
        vm.expectRevert(ProofCanvas.MintClosed.selector);
        fresh.mint(0);
    }
    function testUnapprovedOracleSignerCannotBeChanged() public {
        vm.prank(alice);
        vm.expectRevert();
        p.setOracleSigner(alice);
    }
    function testInvalidOracleAnswerTypeRejected() public {
        bytes32 claim = _register();
        IMDOracleV2.Attestation memory a = _attest(bytes32(uint256(8)));
        a.answerType = 1;
        vm.expectRevert(ProofCanvas.OracleClaimInvalid.selector);
        p.acceptOracleProof(claim, a, _sign(a));
    }
    function testOracleWorkCannotBeReusedForSecondClaim() public {
        bytes32 claim = _register();
        IMDOracleV2.Attestation memory a = _attest(bytes32(uint256(8)));
        p.acceptOracleProof(claim, a, _sign(a));
        vm.prank(alice);
        vm.expectRevert(ProofCanvas.BadInput.selector);
        p.registerOracleClaim(1, 1, WORK, EVIDENCE, CATEGORY, keccak256("another"));
    }
    function testFreezeStopsOracleAccept() public {
        bytes32 claim = _register();
        vm.prank(alice); p.freeze(1);
        IMDOracleV2.Attestation memory a = _attest(bytes32(uint256(8)));
        vm.expectRevert(ProofCanvas.ArchivedOrFrozen.selector);
        p.acceptOracleProof(claim, a, _sign(a));
    }
    function testCriticalTransferAwayAndBackMustInvalidateClaim() public {
        bytes32 claim = _register();
        vm.prank(alice); p.transferFrom(alice, bob, 1);
        vm.prank(bob); p.transferFrom(bob, alice, 1);
        IMDOracleV2.Attestation memory a = _attest(bytes32(uint256(8)));
        vm.expectRevert(ProofCanvas.OracleClaimInvalid.selector);
        p.acceptOracleProof(claim, a, _sign(a));
    }
    function testCriticalCollaborationTransferAwayAndBackInvalidatesClaim() public {
        vm.prank(bob); p.mint(bytes32("bob-agent"));
        vm.prank(alice);
        bytes32 claim = p.requestOracleCollaboration(1, 2, 1, WORK, EVIDENCE, QUESTION);
        vm.prank(bob); p.confirmOracleCollaboration(claim);
        vm.prank(bob); p.transferFrom(bob, address(0xCAFE), 2);
        vm.prank(address(0xCAFE)); p.transferFrom(address(0xCAFE), bob, 2);
        IMDOracleV2.Attestation memory a = _attest(bytes32(uint256(15)));
        vm.expectRevert(ProofCanvas.OracleClaimInvalid.selector);
        p.acceptOracleCollaboration(claim, a, _sign(a));
    }

    function testCancelUnconfirmedCollaborationOnFirstOwnerRoundTrip() public {
        vm.prank(bob); p.mint(bytes32("bob-agent"));
        vm.prank(alice);
        bytes32 claim = p.requestOracleCollaboration(1,2,1,WORK,EVIDENCE,QUESTION);
        vm.prank(alice); p.transferFrom(alice,address(0xCAFE),1);
        vm.prank(address(0xCAFE)); p.transferFrom(address(0xCAFE),alice,1);
        vm.prank(bob);
        vm.expectRevert(ProofCanvas.OracleClaimInvalid.selector);
        p.confirmOracleCollaboration(claim);
    }
    function testCannotRegisterUnapprovedOracleQuestion() public {
        vm.prank(alice);
        vm.expectRevert(ProofCanvas.OracleQuestionNotApproved.selector);
        p.registerOracleClaim(1,1,WORK,EVIDENCE,CATEGORY,keccak256("unapproved"));
    }
    function testLegacyProofsCannotBeReenabledAfterSealing() public {
        p.setLegacyProofsEnabled(true);
        p.sealLegacyProofs();
        assertFalse(p.legacyProofsEnabled());
        assertTrue(p.legacyProofsSealed());
        vm.expectRevert(ProofCanvas.LegacyDisabled.selector);
        p.setLegacyProofsEnabled(true);
    }
    function testNonOwnerCannotApproveQuestion() public {
        vm.prank(alice);
        vm.expectRevert();
        p.approveOracleQuestion(keccak256("fake work"),true);
    }
    function testRevokedQuestionInvalidatesPendingWork() public {
        bytes32 claim = _register();
        p.approveOracleQuestion(QUESTION, false);
        IMDOracleV2.Attestation memory a = _attest(bytes32(uint256(77)));
        bytes memory signature = _sign(a);
        vm.expectRevert(ProofCanvas.OracleQuestionNotApproved.selector);
        p.acceptOracleProof(claim, a, signature);
    }

    function testRevokedQuestionInvalidatesPendingCollaboration() public {
        vm.prank(bob); p.mint(bytes32("bob-agent"));
        vm.prank(alice);
        bytes32 claim = p.requestOracleCollaboration(1, 2, 1, WORK, EVIDENCE, QUESTION);
        vm.prank(bob); p.confirmOracleCollaboration(claim);
        p.approveOracleQuestion(QUESTION, false);
        IMDOracleV2.Attestation memory a = _attest(bytes32(uint256(78)));
        bytes memory signature = _sign(a);
        vm.expectRevert(ProofCanvas.OracleQuestionNotApproved.selector);
        p.acceptOracleCollaboration(claim, a, signature);
    }

}
