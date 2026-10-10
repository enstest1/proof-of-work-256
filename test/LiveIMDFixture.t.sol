// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "forge-std/Test.sol";
import "../src/IMDOracleV2.sol";

contract FixtureRecoverer {
    function recover(IMDOracleV2.Attestation calldata a, bytes calldata sig) external view returns (address) {
        return IMDOracleV2.recover(a, sig);
    }
}

/// @dev Immutable public attestation from https://api.imd.fun/oracle/requests/2509431b-cb09-40b4-9784-4ab61c7db9cb/attestation
/// Attestation targets a Robinhood Chain consumer, not our as-yet undeployed NFT.
contract LiveIMDFixtureTest is Test {
    function testActualIMDV2AttestationRecoversPublicSigner() public {
        vm.chainId(4663);
        address consumer = 0x265C541aA5C5f202e1e3024570CB7d8B278cA691;
        FixtureRecoverer impl = new FixtureRecoverer();
        vm.etch(consumer, address(impl).code);
        IMDOracleV2.Attestation memory a = IMDOracleV2.Attestation({
            requestId: 0x2509431bcb0940b497844ab61c7db9cb00000000000000000000000000000000,
            chainId: 1,
            questionHash: 0x3c5ab9062287bdcb838b63c12eeb0f5671d53205869a281fc2a860ee90086c22,
            answerType: 0,
            answer: abi.encode(true),
            figure: 0,
            fromBlock: 26149269,
            toBlock: 26149565,
            blockHash: 0xf00e9efa6f9bcc89ae976d90b94c7c8c2669148ba070933646c094ddca3a0821,
            panelJobId: 0xb73a79eb96704de29c67ef7948404baa00000000000000000000000000000000,
            panelSize: 11,
            quorum: 6,
            agreed: 7,
            issuedAt: 1791485369,
            expiresAt: 1791571769
        });
        bytes memory signature = hex"d99f5fa966c9932adede4c844a0718afea78956662180fc82625236d3aa09a7f139650e88614a2ce987281f4e6dc99f60bf1b7941b70ca9e8576addca08a54e51c";
        assertEq(FixtureRecoverer(consumer).recover(a, signature), 0x5598Aa9146215Bc13eb26f2c692Ad1461Fd32982);
    }
}
