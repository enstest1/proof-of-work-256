# IMD NFT-only contract launch prompt

**Do not paste a private key, mnemonic or seed phrase. No ERC-20 token or liquidity pool should be generated.**

Build and deploy **PROOF//OF//WORK: THE 256**, an existing Solidity ERC-721 generative art and verifiable-work protocol, using the public reference code at https://github.com/enstest1/proof-of-work-256 . Deploy on **Robinhood Chain mainnet, chain ID 4663** through the IdentityMD `evm_contracts` contract-only launch mechanism. The NFT collection is named `PROOF//OF//WORK: THE 256` (symbol `PROOF`), with exactly 256 Genesis canvases and a maximum of 16 separate Monument NFTs. Genesis mint must remain OFF after deployment. There is no fungible ERC-20 supply, no swap pool and no team pre-mint.

Each canvas has deterministic onchain SVG art and a history that evolves only when a native IMD Oracle v2 EIP-712 signed attestation passes a precommitted question policy, signature, quorum, expiry, source chain and replay checks. Ownership epochs invalidate pending authorizations after transfer. Verified collaborations require both owners and update both canvases. A Monument requires four different-archetype parent canvases with six collaboration links; archives originals permanently. Publicly record provenance and preserve reproducible history. The legacy project-signed attestation pathway must be irreversibly disabled for production. Source uses OpenZeppelin and Solidity 0.8.24; reference repository contains 47 Foundry tests and a passing GitHub Actions workflow.

Carry out contract build, additional independent testing, adversarial review, verifiable deployment with confirmed user-controlled admin owner, publication of final source/ABIs, and a live frontend pointing to the actual deployed contract addresses. The gallery demo already exists at https://collector-gallery-production.up.railway.app/ . Never present simulated preview jobs as authentic oracle attestations. Return the IMD launch ID, onchain transaction hash, verified contract(s), admin owner and deployer addresses. Confirm how the deployer maps to the hackathon's prize payout before entering a contract address on Radar.

## API observations

- Free `launch.open` preflight with `kind: contracts`, `chainId:4663` returned **no hard blockers**, but `judged:false`; this is NOT an accepted or paid launch.
- Free `workflow.open` preflight for contract->site workflow returned `evaluation_unavailable` and `judged:false`. This is an upstream evaluation blocker: do not pay an unclear or incompatible quote.
- A genuinely qualifying IMD release requires a wallet-approved paid request and successful deployed outcome. One action is currently documented at 0.5 IMD plus any user-side chain gas. Confirm live quote before signing.

Official: https://explorer.imd.fun/launch and https://imd.fun/docs/
## Verified root import and unpaid quote (October 9, 2026)

- IMD `POST /requests/import` returned `ok: true` for `kind: contracts` on main at commit `9ce4f62bf5d14e5801a2bcbe0289bc7ccd278b7c`. Root layout is `src/`, `test/`, and `foundry.toml` with `bytecode_hash = "none"`.
- An actual **unpaid** `POST /requests/quote` returned `created: true`, `status: quoted`, cost `500000000000000000` atomic IMD (0.5 IMD). This quote expires and was NOT submitted or paid. Admission does not guarantee a successful result.
- For existing imported repositories, the launch's first step **must** be `audit-imported-code`; a quote without it was rejected as `audit_required`. A tested chain is `audit-imported-code` → `build-contract-project` → `write-foundry-tests` (paths `test`) → `adversarial-review`; `onchain: "evm_contracts"`, `chainId: 4663`, `contracts: ["src/ProofCanvas.sol", "src/SwarmScoreRegistry.sol"]` and the pinned `repoUrl`/`baseCommit`.
- Verify the exact newest main commit and quote again at signing time. Do not reuse the expired trial quote. The owner is the wallet signing/payment identity unless a user-controlled owner is explicitly specified in the paid input.
- A separate real `oracle.request` and `registerOracleClaim` + `SwarmScoreRegistry.commitScore` are needed before claims of live swarm evolution. The signed attestation must be issued **after** precommitment, and `SwarmScoreRegistry.finalizeScore` only follows native `ProofCanvas.acceptOracleProof`.
- Do not enter an IMD factory deployer contract in Radar's address field until its prize payout behavior is clarified; see `docs/HACKATHON-SUBMISSION.md`.
