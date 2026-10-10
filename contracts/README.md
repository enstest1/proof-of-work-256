# ProofCanvas — Solidity contracts

This is a tested implementation candidate, **not an audited public-mint release**. See [`../docs/RELEASE-VERIFICATION-2026-10-08.md`](../docs/RELEASE-VERIFICATION-2026-10-08.md) for exact executed test results and remaining release gates.

## Build and test

Install Foundry 1.8.5+ and run:

```bash
cd contracts
forge install --no-commit OpenZeppelin/openzeppelin-contracts@dbb6104ce834628e473d2173bbc9d47f81a9eec3
forge install --no-commit foundry-rs/forge-std@0258fe875e1d8e207c1eb7175e542ea32356773c
forge build --sizes
forge test --fuzz-runs 1024 --summary
```

Contract uses Solidity 0.8.24, OpenZeppelin v5, and `via_ir=true` in `foundry.toml`. Running `forge coverage` without optimized via-IR is currently unsupported because of Solidity stack-depth constraints.

## Explicit trust model

- `acceptOracleProof` and `acceptOracleCollaboration` verify full IdentityMD Oracle v2 EIP-712 signed records.
- Owner may choose the accepted oracle signer and preapprove exact oracle question hashes. Signed consensus about a question is not proof of job quality, agent independence or absence of collusion.
- Legacy project-controlled signed proofs exist for backwards compatibility and local tests. They are disabled by default and can be irreversibly deactivated with `sealLegacyProofs()`; do so before exposing public minting.
- The source contains an onchain bounded SVG renderer and 256 Genesis/16 Monument ceilings, but the separate web demo's SVG is only an illustrative preview.
- Ownership transfer epochs invalidate all previously pending proof and collaboration authorizations, including transfer-away-and-back cases.

**No real contract address or verified paid IMD consumer integration is bundled.** Do not open mint, claim official launch qualification, or market the collection as secure before the remaining gates are satisfied.
