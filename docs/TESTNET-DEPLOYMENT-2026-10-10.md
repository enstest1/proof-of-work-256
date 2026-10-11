# Testnet deployment evidence - October 10, 2026

This is a **real onchain Robinhood Chain Testnet deployment**, not a mainnet launch, IMD-paid execution, security audit or hackathon submission. Testnet chain ID: **46630**. This document and web/testnet-deployment.json contain **public information only**.

| Component | Onchain reference |
|---|---|
| ProofCanvas ERC-721 | [0x15DD7ebd24E0F166B66DD822f38D9BA6b9321632](https://explorer.testnet.chain.robinhood.com/address/0x15DD7ebd24E0F166B66DD822f38D9BA6b9321632) |
| SwarmScoreRegistry | [0x0936b5F2fc2c561f9607Da331F650C93bbaE3695](https://explorer.testnet.chain.robinhood.com/address/0x0936b5F2fc2c561f9607Da331F650C93bbaE3695) |
| Test wallet / contract owner | [0xb6161ef16444e174077c5B3Cfd37a1da1e8DD942](https://explorer.testnet.chain.robinhood.com/address/0xb6161ef16444e174077c5B3Cfd37a1da1e8DD942) |
| ProofCanvas deployment | [0x18c9fcbb11c934ef2b7c5bd09ec6226f20b7541b4ef9f6844d64dbb41f63c482](https://explorer.testnet.chain.robinhood.com/tx/0x18c9fcbb11c934ef2b7c5bd09ec6226f20b7541b4ef9f6844d64dbb41f63c482) |
| Registry deployment | [0x816357e83124504b8f94ba93558c4a313f536c054c96a68a716b6f4714f56eda](https://explorer.testnet.chain.robinhood.com/tx/0x816357e83124504b8f94ba93558c4a313f536c054c96a68a716b6f4714f56eda) |
| Open test mint | [0x640d3c6f0195a99f742e1b6186a0819b17e1e004d5f23bbe13f734a8b63f95d5](https://explorer.testnet.chain.robinhood.com/tx/0x640d3c6f0195a99f742e1b6186a0819b17e1e004d5f23bbe13f734a8b63f95d5) |
| Mint Genesis #1 | [0xeceaa9e6c551b4abbaa75a49ceadd35ba7ac785d36015a8490026217bb6bcb58](https://explorer.testnet.chain.robinhood.com/tx/0xeceaa9e6c551b4abbaa75a49ceadd35ba7ac785d36015a8490026217bb6bcb58) |
| Close test mint | [0x59928e06691eb6d9ad0ed4fbaa6b110724048c4d92bae48fda993472661cb45b](https://explorer.testnet.chain.robinhood.com/tx/0x59928e06691eb6d9ad0ed4fbaa6b110724048c4d92bae48fda993472661cb45b) |

## Independently checked by live JSON-RPC calls

- Chain 46630, compiled from source at Git commit [38adfb4354a98d2a247f3d0d288dbde5d6cdd761](https://github.com/enstest1/proof-of-work-256/commit/38adfb4354a98d2a247f3d0d288dbde5d6cdd761).
- Both contract creation transactions succeeded, registry canvas() resolves to ProofCanvas.
- ProofCanvas owner is the dedicated test wallet, and the initial state had mintOpen() == false, legacyProofsEnabled() == false, oracleSigner() == address(0) and zero Genesis tokens.
- The controlled test minted **token ID 1**, and the owner is the test wallet. 	okenURI(1) decoded to a valid inline JSON and SVG image with name Genesis #1.
- The final mintOpen() == false, with **exactly one** Genesis token minted, and no signed project-specific IMD oracle proof.
- 47 Solidity tests and 28 Node tests passed against the latest GitHub main source. Local dry-run against testnet completed without broadcast before these testnet transactions.
- **Independent security audit: not completed**. Explorer source-code verification: **not yet established**. No mainnet gas or real cryptocurrency was spent.

## Release limitations

The public gallery remains a demo with simulated agent/artwork history; web/deployment.json must continue to say deployed:false and mintingEnabled:false for mainnet. The separate web/testnet-deployment.json is descriptive metadata and **not** an instruction to open the public mint. Testnet metadata rendering is not yet the same byte-for-byte algorithm as the cinematic offchain art prototype. The test wallet is never appropriate for real funds.

A qualifying hackathon entry still requires genuine IMD job records, independent seats and evidence review, valid native IMD Oracle v2 attestation to the live mainnet consumer, source verification, independent security assessment, a separately controlled production deployer wallet, dedicated project X account and the official Radar form submission. Do not claim testnet work qualifies as an authenticated IMD mainnet launch.