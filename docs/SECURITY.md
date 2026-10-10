# Security and authenticity checklist

**Deployment is blocked until these are cleared.**

1. **Verifier trust**: Legacy path (disabled by default) trusts an `attestor` EOA to vouch for work quality and participant roles. An ECDSA-valid signature is not proof of honest work; require a formal statement of the oracle's verification procedures and publish every evidence manifest hash. Use dedicated multisig / audited oracle adapter when feasible.
2. **IMD EIP-712 integration**: Do not reuse a generic Oracle signature as a Proof signature. Native v2 EIP-712 verification has been implemented; it still requires actual IMD fixtures, a pinned signer, testnet tests, and a real evidence-policy review.
3. **Signer rotation**: This contract validates signatures only against the *current* attestor. Historical receipts are persisted but pending older signatures are invalid on rotation; define an epoch-based upgrade policy before launch.
4. **Mint fairness**: Current genes are `hash(chainId,contract,id)` and are predictable. Use proven commit/reveal with VRF or immutable predetermined art schedule with transparent disclosure and anti-preferential-assignment controls.
5. **Economic logic**: Mint is free and first-come-first-served, one per wallet; trivial Sybil minting is possible. Do not describe as bot-resistant, fair distribution, or randomized rarity.
6. **Agent attribution**: User-supplied `agentKey` is an opaque bytes32 field, **not proof of ownership of an ERC-8004 agent**. Implement identity signing/registry validation or make display explicit.
7. **Renderability**: Onchain string concatenation can run out of gas during tokenURI. Measure calls at maximum 48 nodes on target RPC; benchmark mint and metadata. Consider fixed point SVG renderer or immutable media commitments.
8. **Replay boundaries**: `consumedWork` is global per contract and the signed digest is chain/contract bound. Verify across multiple contracts, nonce uniqueness, expiration boundary and zero data against fuzz tests.
9. **Collaboration**: Trust attestor for roles; a signer may collude with two controlled wallets. Do not advertise that pairwise wallet distinction proves independent contributors.
10. **Monument archiving**: Parent NFTs become untransferable when archived; holder retains record ownership. Contract must define whether royalties, vault custody or transfer to monument follow. This prototype locks and does NOT transfer parent NFT into a vault.
11. **Contracts**: Complete full Foundry test suite, invariant checks, slither/static analyzers, deployment scripts, dependency pinning, external audit for irreversible production use; verify source on target explorer.
12. **Frontend**: Never let simulation increment real proof counters. Read actual state via chain RPC before minting, gating actions and showing honest attestation state. Explain contract authority and verification limitations prominently.
13. **Financial safety**: No liquidity or token sale should be initiated before the IMD launch terms, fees, pool-share settings and smart contract economics are reviewed. No private keys in this repository.
