// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "forge-std/Script.sol";
import "../src/ProofCanvas.sol";
contract Deploy is Script {
    function run() external returns (ProofCanvas) {
        address owner = vm.envAddress("PROOF_OWNER");
        address legacyAttestor = vm.envAddress("PROOF_LEGACY_ATTESTOR");
        vm.startBroadcast();
        ProofCanvas collection = new ProofCanvas(owner, legacyAttestor);
        vm.stopBroadcast();
        require(!collection.mintOpen(), "mint must start closed");
        require(!collection.legacyProofsEnabled(), "legacy proof must start disabled");
        require(collection.oracleSigner() == address(0), "oracle signer must start unconfigured");
        return collection;
    }
}
