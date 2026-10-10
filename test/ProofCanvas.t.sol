// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "forge-std/Test.sol";
import "../src/ProofCanvas.sol";

contract ProofCanvasTest is Test {
    ProofCanvas p;
    uint256 attestorKey = 0xABCD;
    address collector = address(0xBEEF);
    function setUp() public {
        p = new ProofCanvas(address(this), vm.addr(attestorKey));
        p.setMintOpen(true);
        p.setLegacyProofsEnabled(true);
        vm.prank(collector); p.mint(bytes32("agent"));
    }
    function signProof(uint256 id, bytes32 workId, uint64 expiry) internal returns (bytes memory) {
        bytes32 structure = keccak256(abi.encode(p.PROOF_TYPEHASH(), id, workId, bytes32("evidence"), bytes32("code"), expiry, uint256(1)));
        bytes32 digest = keccak256(abi.encodePacked("\x19\x01", p.DOMAIN_SEPARATOR(), structure));
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(attestorKey, digest);
        return abi.encodePacked(r, s, v);
    }
    function testMint() public view {
        assertEq(p.ownerOf(1), collector);
        assertEq(p.genesisMinted(), 1);
        assertTrue(bytes(p.tokenURI(1)).length > 100);
    }
    function testAcceptedProofAndReplay() public {
        uint64 expiry = uint64(block.timestamp + 1 days);
        bytes memory sig = signProof(1, bytes32("job1"), expiry);
        p.acceptProof(1, bytes32("job1"), bytes32("evidence"), bytes32("code"), expiry, 1, sig);
        (,,uint64 proofs,,,,) = p.canvas(1);
        assertEq(proofs, 1);
        vm.expectRevert(ProofCanvas.UsedWork.selector);
        p.acceptProof(1, bytes32("job1"), bytes32("evidence"), bytes32("code"), expiry, 1, sig);
    }
    function testRejectWrongSigner() public {
        uint64 expiry = uint64(block.timestamp + 1 days);
        bytes32 structHash = keccak256(abi.encode(p.PROOF_TYPEHASH(), uint256(1), bytes32("job1"), bytes32("evidence"), bytes32("code"), expiry, uint256(1)));
        bytes32 digest = keccak256(abi.encodePacked("\x19\x01", p.DOMAIN_SEPARATOR(), structHash));
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(0x1234, digest);
        vm.expectRevert(ProofCanvas.InvalidProof.selector);
        p.acceptProof(1, bytes32("job1"), bytes32("evidence"), bytes32("code"), expiry, 1, abi.encodePacked(r,s,v));
    }
    function testOnlyOneMintPerWallet() public {
        vm.prank(collector);
        vm.expectRevert(ProofCanvas.MintCap.selector);
        p.mint(0);
    }
    function testFreezePreventsProof() public {
        vm.prank(collector); p.freeze(1);
        uint64 expiry = uint64(block.timestamp + 1 days);
        bytes memory sig = signProof(1, bytes32("job1"), expiry);
        vm.expectRevert(ProofCanvas.ArchivedOrFrozen.selector);
        p.acceptProof(1, bytes32("job1"), bytes32("evidence"), bytes32("code"), expiry, 1, sig);
    }
}
