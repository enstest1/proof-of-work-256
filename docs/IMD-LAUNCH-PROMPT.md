# IMD NFT-only contract launch prompt

**Do not paste a private key, mnemonic or seed phrase. No ERC-20 token or liquidity pool should be generated.**

Build and deploy **PROOF//OF//WORK: THE 256**, an existing Solidity ERC-721 generative art and verifiable-work protocol, using the public reference code at https://github.com/enstest1/proof-of-work-256 . Deploy on **Robinhood Chain mainnet, chain ID 4663** through the IdentityMD `evm_contracts` contract-only launch mechanism. The NFT collection is named `PROOF//OF//WORK: THE 256` (symbol `PROOF`), with exactly 256 Genesis canvases and a maximum of 16 separate Monument NFTs. Genesis mint must remain OFF after deployment. There is no fungible ERC-20 supply, no swap pool and no team pre-mint.

Each canvas has deterministic onchain SVG art and a history that evolves only when a native IMD Oracle v2 EIP-712 signed attestation passes a precommitted question policy, signature, quorum, expiry, source chain and replay checks. Ownership epochs invalidate pending authorizations after transfer. Verified collaborations require both owners and update both canvases. A Monument requires four different-archetype parent canvases with six collaboration links; archives originals permanently. Publicly record provenance and preserve reproducible history. The legacy project-signed attestation pathway must be irreversibly disabled for production. Source uses OpenZeppelin and Solidity 0.8.24; reference repository contains 40 Foundry tests and a passing GitHub Actions workflow.

Carry out contract build, additional independent testing, adversarial review, verifiable deployment with confirmed user-controlled admin owner, publication of final source/ABIs, and a live frontend pointing to the actual deployed contract addresses. The gallery demo already exists at https://collector-gallery-production.up.railway.app/ . Never present simulated preview jobs as authentic oracle attestations. Return the IMD launch ID, onchain transaction hash, verified contract(s), admin owner and deployer addresses. Confirm how the deployer maps to the hackathon's prize payout before entering a contract address on Radar.

## API observations

- Free `launch.open` preflight with `kind: contracts`, `chainId:4663` returned **no hard blockers**, but `judged:false`; this is NOT an accepted or paid launch.
- Free `workflow.open` preflight for contract->site workflow returned `evaluation_unavailable` and `judged:false`. This is an upstream evaluation blocker: do not pay an unclear or incompatible quote.
- A genuinely qualifying IMD release requires a wallet-approved paid request and successful deployed outcome. One action is currently documented at 0.5 IMD plus any user-side chain gas. Confirm live quote before signing.

Official: https://explorer.imd.fun/launch and https://imd.fun/docs/