// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "forge-std/Test.sol";
import "../src/ProofCanvas.sol";

contract AdditionalFuzzTest is Test {
    ProofCanvas p;
    address alice = address(0xA11CE);
    function setUp() public {
        p = new ProofCanvas(address(this), address(0xBEEF));
        p.setMintOpen(true);
        vm.prank(alice); p.mint(bytes32("alice"));
    }
    function testFuzzOneMintPerWallet(address wallet) public {
        vm.assume(wallet != address(0) && wallet != alice);
        vm.prank(wallet); p.mint(bytes32("test"));
        vm.prank(wallet); vm.expectRevert(ProofCanvas.MintCap.selector); p.mint(bytes32("test2"));
        assertEq(p.mintCounts(wallet), 1);
    }
    function testFuzzTransferGenerationIncrements(address interim) public {
        vm.assume(interim != address(0) && interim != alice);
        vm.prank(alice); p.transferFrom(alice,interim,1);
        assertEq(p.ownershipEpoch(1),1);
        vm.prank(interim); p.transferFrom(interim,alice,1);
        assertEq(p.ownershipEpoch(1),2);
    }
    function testFuzzCannotMintAfterOwnerCloses(address wallet) public {
        vm.assume(wallet != address(0));
        p.setMintOpen(false);
        vm.prank(wallet); vm.expectRevert(ProofCanvas.MintClosed.selector); p.mint(0);
    }
    function testFuzzCannotFreezeUnownedCanvas(address wallet) public {
        vm.assume(wallet != alice && wallet != address(0));
        vm.prank(wallet); vm.expectRevert(ProofCanvas.NotTokenOwner.selector); p.freeze(1);
    }
    function testFuzzNoPendingClaimAcceptsPostTransfer(bytes32 question, bytes32 workId, address receiver) public {
        vm.assume(question != 0 && workId != 0 && receiver != address(0) && receiver != alice);
        p.approveOracleQuestion(question,true);
        vm.prank(alice); bytes32 claim = p.registerOracleClaim(1,1,workId,keccak256("artifact"),keccak256("category"),question);
        vm.prank(alice); p.transferFrom(alice,receiver,1);
        vm.prank(receiver); p.transferFrom(receiver,alice,1);
        (, , , , , , , address prior, uint64 committedEpoch, ) = p.pendingOracleClaims(claim);
        assertEq(prior,alice);
        assertEq(committedEpoch,0);
        assertEq(p.ownershipEpoch(1),2);
    }
}
