// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

/// @notice Verifies the *version 2* IdentityMD OracleAttestation typed data.
/// @dev Source: https://imd.fun/docs/ (Oracle answers, EIP-712 check).
/// The consumer, not the API, determines the trusted signer and domain.
library IMDOracleV2 {
    bytes32 internal constant TYPEHASH = keccak256(
        "OracleAttestation(bytes32 requestId,uint256 chainId,bytes32 questionHash,uint8 answerType,bytes answer,uint256 figure,uint64 fromBlock,uint64 toBlock,bytes32 blockHash,bytes32 panelJobId,uint16 panelSize,uint16 quorum,uint16 agreed,uint64 issuedAt,uint64 expiresAt)"
    );
    bytes32 internal constant DOMAIN_TYPEHASH = keccak256(
        "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
    );
    bytes32 internal constant NAME_HASH = keccak256("IdentityMD Oracle");
    bytes32 internal constant VERSION_HASH = keccak256("2");

    struct Attestation {
        bytes32 requestId;
        uint256 chainId; // data/source chain, not necessarily consumer chain
        bytes32 questionHash;
        uint8 answerType;
        bytes answer;
        uint256 figure;
        uint64 fromBlock;
        uint64 toBlock;
        bytes32 blockHash;
        bytes32 panelJobId;
        uint16 panelSize;
        uint16 quorum;
        uint16 agreed;
        uint64 issuedAt;
        uint64 expiresAt;
    }

    function domainSeparator() internal view returns (bytes32) {
        return keccak256(abi.encode(DOMAIN_TYPEHASH, NAME_HASH, VERSION_HASH, block.chainid, address(this)));
    }

    function hashAttestation(Attestation calldata a) internal pure returns (bytes32) {
        return keccak256(abi.encode(
            TYPEHASH, a.requestId, a.chainId, a.questionHash, a.answerType,
            keccak256(a.answer), a.figure, a.fromBlock, a.toBlock, a.blockHash,
            a.panelJobId, a.panelSize, a.quorum, a.agreed, a.issuedAt, a.expiresAt
        ));
    }

    function recover(Attestation calldata a, bytes calldata signature) internal view returns (address) {
        bytes32 digest = keccak256(abi.encodePacked("\x19\x01", domainSeparator(), hashAttestation(a)));
        return ECDSA.recover(digest, signature);
    }
}
