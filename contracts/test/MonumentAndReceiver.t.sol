// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "forge-std/Test.sol";
import "../src/ProofCanvas.sol";

contract ReentrantMintReceiver {
    ProofCanvas immutable p;
    bool public secondMintBlocked;
    constructor(ProofCanvas collection) { p = collection; }
    function mint() external { p.mint(bytes32("first")); }
    function onERC721Received(address,address,uint256,bytes calldata) external returns(bytes4) {
        try p.mint(bytes32("reentry")) {} catch { secondMintBlocked = true; }
        return this.onERC721Received.selector;
    }
}

contract MonumentAndReceiverTest is Test {
    ProofCanvas p;
    uint256 key=0xABC999;
    uint64 expiry;
    address[4] holders;
    function setUp() public {
        vm.warp(1_700_000_000);
        p=new ProofCanvas(address(this), vm.addr(key));
        p.setMintOpen(true);
        p.setLegacyProofsEnabled(true); // test-only; production MUST seal before mint
        expiry=uint64(block.timestamp+1 days);
        for(uint256 i=0;i<4;++i) {
            holders[i]=address(uint160(0x1000+i));
            vm.prank(holders[i]); p.mint(bytes32(i+1));
        }
    }
    function legacyProof(uint256 id,bytes32 work) internal returns(bytes memory) {
        bytes32 sh=keccak256(abi.encode(p.PROOF_TYPEHASH(),id,work,bytes32("evidence"),bytes32("work"),expiry,uint256(1)));
        bytes32 digest=keccak256(abi.encodePacked("\x19\x01",p.DOMAIN_SEPARATOR(),sh));
        (uint8 v,bytes32 r,bytes32 s)=vm.sign(key,digest);
        return abi.encodePacked(r,s,v);
    }
    function legacyEdge(uint256 a,uint256 b,bytes32 work) internal returns(bytes memory) {
        bytes32 typeHash=keccak256("Collaboration(uint256 canvasA,uint256 canvasB,bytes32 workId,uint64 expiresAt)");
        bytes32 sh=keccak256(abi.encode(typeHash,a,b,work,expiry));
        bytes32 digest=keccak256(abi.encodePacked("\x19\x01",p.DOMAIN_SEPARATOR(),sh));
        (uint8 v,bytes32 r,bytes32 s)=vm.sign(key,digest);
        return abi.encodePacked(r,s,v);
    }
    function _proveAll() internal {
        for(uint256 i=1;i<=4;++i) {
            bytes32 work=keccak256(abi.encode("proof",i));
            p.acceptProof(i,work,bytes32("evidence"),bytes32("work"),expiry,1,legacyProof(i,work));
        }
    }
    function _connectAll() internal {
        for(uint256 a=1;a<=4;++a) for(uint256 b=a+1;b<=4;++b) {
            bytes32 work=keccak256(abi.encode("edge",a,b));
            p.acceptCollaboration(a,b,work,expiry,legacyEdge(a,b,work));
        }
    }
    function _collect() internal {
        for(uint256 i=1;i<4;++i) {
            vm.prank(holders[i]);p.transferFrom(holders[i],holders[0],i+1);
        }
    }
    function testFullMonumentCreationArchivesAllParents() public {
        _proveAll(); _connectAll(); _collect();
        uint256[4] memory parents=[uint256(1),2,3,4];
        vm.prank(holders[0]); uint256 id=p.createMonument(parents);
        assertEq(id,5);
        assertEq(p.monumentMinted(),1);
        assertEq(p.ownerOf(id),holders[0]);
        assertTrue(bytes(p.tokenURI(id)).length>100);
        for(uint256 i=1;i<=4;++i) {
            assertTrue(p.archived(i));
            vm.prank(holders[0]);
            vm.expectRevert(ProofCanvas.ArchivedOrFrozen.selector);
            p.transferFrom(holders[0],holders[1],i);
        }
    }
    function testMonumentRequiresAllCollaborationEdges() public {
        _proveAll(); _collect();
        uint256[4] memory parents=[uint256(1),2,3,4];
        vm.prank(holders[0]); vm.expectRevert(ProofCanvas.BadInput.selector); p.createMonument(parents);
    }
    function testERC721ReceiverCannotReenterSecondMint() public {
        ReentrantMintReceiver receiver=new ReentrantMintReceiver(p);
        receiver.mint();
        assertTrue(receiver.secondMintBlocked());
        assertEq(p.mintCounts(address(receiver)),1);
        assertEq(p.genesisMinted(),5);
    }
}
