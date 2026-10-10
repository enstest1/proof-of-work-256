# PROOF//TRIAL v5 — Experience and release gate

## Shipped frontend modules

`web/experience.js`: deterministic, visually differentiated generative compositions for the four DNA archetypes; interactive two-future selector; five-step Birth replay; clickable X-Ray traces keyed by role; five-stage Archive scrubber; 256-node Commons installation with explicitly simulated, dotted conceptual connections. The work is a concept preview. This gallery **does not** currently use live IMD tasks to evolve NFTs and never equates public swarm activity with owned artwork provenance. Layout is responsive and reduced-motion friendly.

`web/app.js`: a new `OPEN PROOF//TRIAL` button in the existing detail modal, with event-based selection; all existing gallery functionality preserved. Public site serves static files and read-only `/api/swarm` telemetry through Railway; no wallet funds or user secrets are handled by this application.

## Authentic work → authentic transformation acceptance gate

1. Wallet-authorized **IMD job.open** with a true DAG or multi-agent job. Archive its immutable IMD job ID, actual work record hashes and independent review results. Do not claim seat independence merely because four opaque IDs are distinct.
2. Define a narrow, checkable oracle question committing to actual work records, four roles and the agreed manifest. Compare it to the current policy. Verify source chain and escrow/question type before paying for `oracle.request`.
3. Deploy source for `ProofCanvas` + `SwarmScoreRegistry` through a genuine IMD contract launch, run independent audit, verify chain, owner and actual deployed bytecode. **Keep mint closed** until verified and project X/payout issues are resolved.
4. When a minted NFT exists, call `ProofCanvas.registerOracleClaim` with the same `workId`, `questionHash`, and `evidenceHash` computed by `SwarmScoreRegistry.canonicalRoot`. `SwarmScoreRegistry.commitScore` must precede oracle issuance and carry actual seat and work-record identifiers, not random demo bytes.
5. Obtain **a real** native IMD OracleAttestation v2 for the deployment's exact EIP-712 consumer domain, and confirm signature, source chain, panel quorum, hash, signed answer and times.
6. Relay `acceptOracleProof`, then `SwarmScoreRegistry.finalizeScore`. Inspect `ScoreFinalized`, `OracleReceiptVerified`, `tokenURI`, and transaction links on the public explorer.
7. Publish a factual `evidence/real-score.json` manifest and run `RPC_URL=<authenticated RPC> node scripts/verify-swarm-score.mjs evidence/real-score.json`. The script checks onchain-to-manifest consistency, not the offchain task's quality. Review original public work records separately before showing named agents and verified artistic marks.
8. Only after this successful chain round trip add a **verified** mode to the X-Ray with actual seat IDs, review evidence URLs, matching attestation and transaction links. The current demo X-Ray intentionally displays `UNVERIFIED PREVIEW` and no mock blockchain addresses.

## Deploy and submission blockers

- Paid IMD launch and a real contract deployment; preflights and unpaid quotes alone aren't enough.
- Independent security audit and consideration of genesis mint fairness (present DNA is deterministic from token ID).
- Authentic multi-agent IMD job, accepted oracle request and onchain proof mutation.
- Project-specific X account and completed Radar submission; verify the contract deployer prize payout rule before entering an address.
- Curated collector test with visual exports and accurate source claims.

The latest proven working source is tagged `imd-validated-v4-20261009`; do not replace audited Solidity as a side effect of publishing the new browser experience. Stage 5 keeps EVM contracts unchanged, with mint disabled.
