# SWARM//DNA — PROOF//OF//WORK 4.0 technical design review
**Status:** proposal only; no contract migrations/deployments. Reviewed 2026-10-09. Deadline 2026-10-21.

## Thesis
The swarm, not an individual NFT owner, is the generative artist. Each accepted swarm task produces an auditable, hash-committed **Swarm Score**: contributions from verifiably different IMD agent seats, independent tests, an oracle verdict, and a deterministic set of visual instructions. The artifact encodes the scored collaboration into art, with each mark traceable back to a committed piece of evidence. The collector owns the artwork/history, not the underlying agent identity.

IMD public docs: https://imd.fun/docs/ ; API: `GET /swarm`, `/jobs/:id/result`, `/seats/:tokenId`, `/work-records/:hash.json`, `/review-documents/:hash.json`, `/oracle/requests/:id/attestation`. Do not claim native IMD capability beyond public documented formats.

## Findings from existing source
1. The current onchain SVG renderer uses almost exclusively radial lines and doesn't use archetype to select a genuinely distinct geometry family. `MAX_RENDER_NODES=48` caps visual detail; collector appeal is currently a prototype.
2. Genesis DNA is deterministic from (chainId, contract, sequential token ID). It is **not** unpredictable randomness. Mint can be selectively timed; market the design as predetermined or introduce an audited fair reveal.
3. `agentKey` is user-entered bytes32; it does not authenticate an IMD seat/ERC-8004 ID.
4. A native oracle `bool true` proves the attestor signed an outcome for a question hash. A curator controls approved question hashes. Without a pinned work-admissibility policy tied to the job/evidence, a trivial question could earn an evolution. Security tests are necessary but not sufficient.
5. Collaboration receipts mutate two `history` values but do not increment `Canvas.proofs` or provide role/agent provenance; only a generic collaboration event survives.
6. `createMonument` requires a **single msg.sender to own all four** Genesis NFTs. That directly conflicts with a four-owner collaborative monument narrative. Either redesign four-owner consent or describe current behavior accurately.
7. Deployment and paid IMD proof round-trip are still missing. The existing gallery is only a preview; never call it launched or fully IMD-verified.

## P0 — Ship before the deadline
**A. Evidence-bound Swarm Score v1.** Each qualifying evolution stores/commits:
- source chain, native IMD job ID, role-specific accepted work record hashes (or a Merkle root), specific artifact hash and verifier policy version;
- seat IDs and work roles derived from verifiable IMD records, not user-entered labels;
- same exact evidence root and task definitions included in the oracle's approved question/definitions;
- native IMD OracleAttestation v2 signature, quorum, expiry, question hash and request replay protection, using the existing adapter.
Use one coordinator/worker to read public IMD results, normalize an immutable manifest and request an IMD oracle attestable claim. The coordinator can submit, never unilaterally declare success. If a distinct seat/role cannot be substantiated, show **unattributed or unverified** rather than inventing it.

**B. Art that encodes DIFFERENT contributions.** Four visual grammars for archetypes (Orbit, Lattice, Vessel, Fracture). Plot shapes are deterministic onchain/offchain from committed seed and accepted score root. Each accepted role produces an independently traceable visual component. A shared collaboration motif is computed once from the joint receipt, and appears in both canvases. Cap onchain rendering complexity but avoid 48 random spokes masquerading as collectible art. Visually blind-test at least 20 outputs.

**C. Proof Explorer.** A visitor clicking one line sees: actual agent seat, its work and job, role, verified artifact hash, oracle request, panel/quorum and transaction; show an explicit difference between authentic onchain proofs, offchain explanatory metadata and simulated examples. Pin manifest and source so the history can be reconstructed.

**D. Live IMD flow.** One real IMD multi-step task (ideally `shape: dag` or `fan_out_join`; steps <= 6) produces independent accepted work/reviews. One real `oracle.request` with `evidence: panel` or a supported chain recipe and `consumer` pinned to ProofCanvas on deployment chain yields a signature for a pre-registered claim. Relay, verify, emit event and visibly update canvas. Require an IMD launch transaction, source verification and immutable proof links. No false claims that IMD guarantees independent agent selection without the receipts.

## P1 — Only if P0 done
**E. Proof of dissent.** If actual panel data includes a verified disagreement/low consensus within a successful signed attestation, render a distinctive `scar` mapped to (panelSize - agreed), with raw panel transparency. Disagreed/unsigned outcomes must not update proof history as verified unless a separate authenticated mechanism exists. Never incent fake failures.

**F. Collector choice.** Owners can choose an irreversible **preserve** versus **continue evolving** exhibition state, while the underlying accepted receipt history remains permanent. Separate historical snapshot identity from live NFT metadata. No gas-heavy replay onchain.

**G. Commons.** A global installation displaying the collection as a signed collaboration graph. Proof-backed edges are permanent; transient swarm status (agents online, jobs in progress) is a clearly labeled live overlay, **not** itself permanent artwork.

## P2 — Post-hackathon
**H. Four-owner Monument protocol.** EIP-712 permit/consent from four independent owners and an atomic custody/lineage resolution; don't force a single wallet to buy all four assets while calling this cooperation. Fully specify who owns the resulting Monument and rights/custody of parents. Avoid fractional ownership or economic complexity at launch.

**I. Third-party contribution policies, reputation marketplace, v4 economics**: all post-deadline until independently audited.

## Technical composition
- Keep `ProofCanvas.sol` as audited storage and ERC-721 baseline.
- Add `SwarmScoreRegistry.sol`: `commitScore(canvasId, jobId, manifestRoot, evidencePolicyId, ownershipEpoch)` and `acceptScore(...,attestation,signature)`; make acceptance atomic with canvas history update. No duplicate job/attestation across canvases.
- Add `SwarmOrchestrator` offchain: user request → IMD DAG → work/review retrieval → canonical manifest → precommit → IMD oracle request → relay. It is **not** a trusted quality signer; it must publish links and commitments.
- Add `ScoreRenderer` with generated deterministic SVG visual primitives. Keep actual tokenURI self-contained and verify on Robinhood Chain RPC under gas limits.
- Index public `WorkAccepted`, `Collaboration`, `OracleReceiptVerified`, plus richer score events; store only convenience indexes offchain. Rebuild from chain events and pinned manifests.
- Use policies pinned to versioned admissibility templates (approved job type, artifact hash, accepted work, seat attribution, independent verifier); no arbitrary 'did a good job?' yes/no questions.

## Specific demo (90 seconds)
1. Show one Genesis masterpiece, whose four visual families are immediately identifiable.
2. Open one real IMD job as a multi-step DAG; show four actual role outcomes and job/seat provenance.
3. Show an independently checked oracle question and its *authentic* signed answer.
4. Submit the committed score and visibly evolve one Canvas and a linked companion Canvas.
5. Click a line and prove which work, agent, verifier and transaction caused it.
6. Zoom out to the Commons; all edges come from work, not decorative network animation.

## Release gates / sequencing
- Oct 9–11: evidence manifest specification, exactly-one committed proof round-trip, current contract+front-end defects fixed.
- Oct 12–14: four genuine renderer grammars, proof explorer, full tests, extensive blind visual review.
- Oct 15–17: IMD launch and authentic verification, verify addresses, deploy connected frontend with mint CLOSED.
- Oct 18–19: independent adversarial review, source verification, collector UX and video.
- Oct 20: project X account and Radar entry after a qualifying contract is actually live; Oct 21 reserve for failures.
Do not spend days building Monuments v2 before demonstrating one real oracle-driven evolution. The key gate is **verified distinct IMD work → authenticated oracle → irreversible onchain receipt → recognizable art transformation**.

## Nonnegotiable security claims
- EIP-712 attestation confirms signer/question/outcome and quorum; it does not independently prove task usefulness or seat independence.
- Do not show offchain panel votes as independently verifiable chain signatures.
- Default closed mint, explicit irreversible legacy-signer seal, owner on a real user-controlled wallet, no keys committed.
- Mainnet only after IMD NFT-only launch terms and Radar prize-deployer ownership issue are resolved.
- Never label "originality 10/10" or "collector appeal 10/10" as objective without external collector evidence.
