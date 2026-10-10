// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/ProofCanvas.sol";
import "../src/SwarmScoreRegistry.sol";

/// @notice Deploys both contracts together. With no --broadcast, this is a
///         read-only local simulation on a real testnet fork (no funds spent).
contract DeployTestnet is Script {
    function run() external returns (ProofCanvas proof, SwarmScoreRegistry registry) {
        address owner = vm.envAddress("PROOF_OWNER");
        if (owner == address(0)) revert("OWNER_MUST_BE_SET");
        vm.startBroadcast();
        proof = new ProofCanvas(owner, owner);
        registry = new SwarmScoreRegistry(address(proof));
        vm.stopBroadcast();
        require(!proof.mintOpen(), "MINT_NOT_CLOSED");
        require(!proof.legacyProofsEnabled(), "LEGACY_NOT_DISABLED");
        require(proof.oracleSigner() == address(0), "SIGNER_UNCONFIGURED_REQUIRED");
        require(address(registry.canvas()) == address(proof), "REGISTRY_MISMATCH");
    }
}
