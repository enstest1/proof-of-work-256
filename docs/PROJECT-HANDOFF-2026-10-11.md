# PROOF//OF//WORK — THE 256: Full Continuation Handoff
**State checked October 11, 2026 (Pacific time)**
**Repository:** https://github.com/enstest1/proof-of-work-256
**Last verified published commit before this handoff:** 84e0d3e8323a31c042ac024de6df026aadc07c8e
**Working branch:** main, clean and synchronized with origin/main at that check.
**Hackathon:** IdentityMD (IMD) / IMD Radar; working target deadline **October 21, 2026** according to the prior event announcement (the Radar form itself does not list a closing timezone; confirm with organizers).
**Status:** GENUINE ROBINHOOD TESTNET DEPLOYMENT + REAL TEST NFT; PUBLIC PREVIEW OPERATING; **NOT MAINNET, NOT IMD-VERIFIED, NOT SUBMITTED**.

## 0. New-chat instruction: start here
You are continuing a live, connected software/hackathon project for the user. DO NOT restart it, invent links or fake completed IMD tasks. Read the public repository (especially `docs/TESTNET-DEPLOYMENT-2026-10-10.md`, `docs/HACKATHON-SUBMISSION.md`, `docs/CONCEPT-ROADMAP.md`, `docs/MATH-ATELIER.md`, `docs/EXPERIENCE-V5.md`, and GitHub Issue #3). Use connected GitHub, Railway and Desktop Commander tools to carry out the next tasks. Confirm current state and capture rollback before any mutation. Act directly where permissions permit. Separate REAL onchain accepted work from simulated visuals. Never request, reveal, log or transmit secret keys; do not spend paid IMD or mainnet currency or submit an inaccurate entry.

**Primary goal:** deliver a striking collector-focused visual artifact whose *actual* changes are caused by independently reviewed, authentic IMD agent work and a deployment-bound signed Oracle v2 receipt, and enter the project into IMD Radar by the hackathon deadline.

## 1. Authoritative links
| Resource | URL |
|---|---|
| Repo / source | https://github.com/enstest1/proof-of-work-256 |
| Public collector preview | https://collector-gallery-production.up.railway.app/ |
| PROOF//TRIAL selector | https://collector-gallery-production.up.railway.app/?canvas=42#trial |
| Latest onchain evidence documentation | https://github.com/enstest1/proof-of-work-256/blob/main/docs/TESTNET-DEPLOYMENT-2026-10-10.md |
| Separate public testnet JSON | https://github.com/enstest1/proof-of-work-256/blob/main/web/testnet-deployment.json |
| Prod manifest (mint intentionally OFF) | https://github.com/enstest1/proof-of-work-256/blob/main/web/deployment.json |
| Submission runbook | https://github.com/enstest1/proof-of-work-256/blob/main/docs/HACKATHON-SUBMISSION.md |
| V5 creative experience | https://github.com/enstest1/proof-of-work-256/blob/main/docs/EXPERIENCE-V5.md |
| Art studio design | https://github.com/enstest1/proof-of-work-256/blob/main/docs/MATH-ATELIER.md |
| Experimental ideas roadmap | https://github.com/enstest1/proof-of-work-256/blob/main/docs/CONCEPT-ROADMAP.md |
| Tracked release gate | https://github.com/enstest1/proof-of-work-256/issues/3 |
| CI workflows | https://github.com/enstest1/proof-of-work-256/actions |
| IMD docs | https://www.imd.fun/docs |
| IMD public explorer | https://explorer.imd.fun |
| IMD protocol / launch UI | https://explorer.imd.fun/launch |
| IMD API capabilities | https://api.imd.fun/requests/capabilities |
| IMD Radar hackathon entry | https://www.imdradar.site/hackathon |
| Radar project account contact | https://x.com/imdradar |
| Midjourney MCP application (separate from hackathon) | https://midjourney.typeform.com/to/iIfEOfZ1 |

## 2. Genuine testnet deploy: verified and closed after mint
**Network:** Robinhood Chain **Testnet**, chain ID **46630**, native test ETH.
**RPC:** https://rpc.testnet.chain.robinhood.com
**Explorer:** https://explorer.testnet.chain.robinhood.com
**Faucet:** https://faucet.testnet.chain.robinhood.com

**Dedicated TEST wallet**: `0xb6161ef16444e174077c5B3Cfd37a1da1e8DD942`
**ProofCanvas NFT contract**: `0x15DD7ebd24E0F166B66DD822f38D9BA6b9321632`
**SwarmScoreRegistry**: `0x0936b5F2fc2c561f9607Da331F650C93bbaE3695`

**Transactions (full verified hashes):**
- ProofCanvas deployment: https://explorer.testnet.chain.robinhood.com/tx/0x18c9fcbb11c934ef2b7c5bd09ec6226f20b7541b4ef9f6844d64dbb41f63c482
- Registry deployment: https://explorer.testnet.chain.robinhood.com/tx/0x816357e83124504b8f94ba93558c4a313f536c054c96a68a716b6f4714f56eda
- Open test mint: https://explorer.testnet.chain.robinhood.com/tx/0x640d3c6f0195a99f742e1b6186a0819b17e1e004d5f23bbe13f734a8b63f95d5
- Mint **Genesis #1**: https://explorer.testnet.chain.robinhood.com/tx/0xeceaa9e6c551b4abbaa75a49ceadd35ba7ac785d36015a8490026217bb6bcb58
- Close test mint: https://explorer.testnet.chain.robinhood.com/tx/0x59928e06691eb6d9ad0ed4fbaa6b110724048c4d92bae48fda993472661cb45b

**Onchain smoke test result:** Both deployment receipts successful, registry points to ProofCanvas; owner is the test wallet; initial mint closed; `legacyProofsEnabled=false`; `oracleSigner=0x000…000`; controlled Genesis token #1 minted to test wallet; `tokenURI(1)` decoded to valid JSON including a Base64 SVG; final `mintOpen=false`; **1** Genesis issued only on testnet. Remaining test wallet balance after all test transactions approximately **0.00993914854 test ETH** (historical, recheck). The test used NO mainnet ETH. Solidity bytecode is deployed onchain but **source-code verification at the explorer was not yet established**.

**Automated tests:** **47/47 Foundry Solidity tests** passing with 1,024 fuzz iterations each applicable fuzz case, **28/28 Node JS tests** passing; Robinhood RPC read-only checks passed; full Foundry deploy script dry-run passed before broadcasting. Source checkout at `38adfb4354a98d2a247f3d0d288dbde5d6cdd761` when deployed, evidence commit `84e0d3e`.

**Security / secrets:** Test wallet key was made with ethers.Wallet.createRandom on the user's *connected Windows machine*, stored as Windows DPAPI encrypted file. It was never checked into GitHub nor Railway. Do not copy it into chat or logs. The test-only keys and helper scripts live at `C:\Users\tomic\AppData\Local\ProofOfWork256\TestWallet`. Do not use it for prize payouts, mainnet assets, long-term custody or production owner keys. Existing helper scripts `Run-Testnet-Deployment.ps1` and `Run-Testnet-MintSmoke.ps1` are for replay/recovery and **must NOT be rerun blindly**: deployment script refuses duplicates if manifest exists; smoke already minted #1, wallet one-mint-per-wallet cap applies.

## 3. Website and deployment: read carefully
**Public domain:** https://collector-gallery-production.up.railway.app
**Verified health:** `/health` returns HTTP 200 and `{"ok":true,"phase":"preview-only","mintOpen":false}`. Home, `/experience.js`, `/app.js` and `/civilization.js` returned 200 in the prior deployment check.

**IMPORTANT open hosting issue:** The most recent oversized Railway Function deploy failed container startup with `exec container process /app/./run.sh: Argument list too long`, even though Railway showed SUCCESS. It was rolled back by redeploying an earlier functional build, preserving the URL. As of this handoff `/art-studio.js` returned **HTTP 404** on the live URL. Thus the newer Math Atelier code exists on GitHub `main` but is **NOT fully live** on this restored build. The current site is a working preview, not 100% synchronized with source. Fix hosting/deployment FIRST: prefer converting the monolithic inlined Railway Function to a conventional service/static site connected to the GitHub repo, or otherwise splitting/bundling into a size-safe deploy, preserve the domain, save a rollback, then test every asset and actual Chrome UI on desktop/mobile. Do not assume a green Railway deployment status means HTTP works.

**Railway account/project:** Project `bc2312d3-311a-47d0-b0f3-4fd4ed34de40`, environment `1dfbc6e1-1006-4d23-a94a-c525a2a37c84`, Function/service `d7881004-c0a5-44f9-8217-dda8d47a6ed1` (collector-gallery), current working redeploy ID `c154f2b1-adc6-412e-923f-340b4b1e192a`. Failed oversized deploy ID `5455fdf0-ddf1-4a26-8946-b03704116d60`. Legacy source backup on remote PC: `C:\Users\tomic\Desktop\pow-solidity-audit-isolated\railway-gallery-pre-trial-v5.tsx`. Public production `web/deployment.json` is deliberately `deployed:false,mintingEnabled:false` for mainnet. Never set it true based on TESTNET contracts; there is now a **separate** `web/testnet-deployment.json` for that.

**Connected Windows workspace:** device `Pelpa` id `66e35338-447a-4f40-872f-b3c2d51b8198`; checkout `C:\Users\tomic\Desktop\pow-solidity-audit-isolated\publish-clean\proof-of-work`, on `main`. Forge: `C:\Users\tomic\Desktop\pow-solidity-audit-isolated\bin\forge.exe`; `node` works; ethers dependencies present. Re-run `forge test --fuzz-runs 1024 --summary` and `node --test tests/*.test.mjs` after edits. Never touch unrelated files.

## 4. Shipped collector concepts vs real-world facts
**A. PROOF//OF//SURVIVAL / PROOF//TRIAL:** Each hypothetical Genesis artwork can be previewed in two artistically distinct futures A/Structure and B/Resilience. Five cinematic illustrated phases: COMMISSION, PROPOSAL, CRITIQUE, ADVERSARY, ARTWORK. Interactive X-Ray attributes art marks to four conceptual roles; a replay scrubber and deterministic SVG export exist. The links/inspector deliberately state SIMULATED or UNVERIFIED; these are **not real IMD tasks/receipts**.

**B. THE LIVING CIVILIZATION / Commons:** 256 candidate Genesis identities, four archetypes/cultures (Orbit, Vessel, Lattice, Fracture), atlas, conceptual network and five illustrative historical eras. Edges are not onchain collaborations yet and **must not be represented as real**.

**C. MATH ATELIER:** Browser source for five deterministic art grammars (Orbit/Vessel/Lattice/Fracture/Civilization); preview vector SVG, 2160x2700 social PNG, ControlNet-compatible line guide, optional SDXL descriptive prompt. This is not a deployed AI diffusion service, not a mint, and not necessarily visible on restored Railway build until its 404 is fixed. Social art previews must say mathematical artwork STUDY or PREVIEW.

**D. Contracts:** `src/ProofCanvas.sol` is ERC-721 256 Genesis + up to 16 Monuments, one wallet mint, signed native IMD Oracle v2 evidence path, collaboration among two token owners, freezing and evolving SVG, replay protection, legacy proofs disabled by default. `src/SwarmScoreRegistry.sol` precommits 4 user-supplied distinct role seat IDs + work hashes; only finalizes if an accepted native signed IMD receipt matches. **Distinct IDs are not cryptographic proof of worker independence**; verify authentic upstream work and oracle question policy. The onchain `svgOf` renderer differs visually from the offchain gallery. DNA is predictable by token ID, not unbiased rarity RNG. Need parity/fairness review before real mint.

## 5. IMD execution: quoted, not paid
Previous work successfully completed free `POST /requests/import` of a public GitHub commit, a free `POST /requests/check` for a 5-stage job DAG, and an unpaid `POST /requests/quote` for `job.open`. The DAG modeled Architect/refinement → Builder/implementation → parallel tests and Adversary/critique → documentation. Quote: **0.5 IMD**; `resultGuaranteed:false`. A second earlier unpaid quote for contract-only `launch.open` also quoted 0.5 IMD with mandatory initial audit step. These were **only quotes**; no IMD charge, accepted job, launch or onchain oracle for this project was produced. Quote/order tokens may expire or be tied to their client instance; re-preflight and requote fresh at time of payment.

IMD has Ethereum mainnet token/payment rails, distinct from Robinhood testnet ETH. Do not spend user's real assets based on prior generalized authorization. Confirm exact chain, wallet, amount, contract deployment pathway and prize deployer mechanics; do not share private keys. The test wallet does not unlock a genuine paid IMD mainnet job.

## 6. Priority release gate (do in order)
**P0, before hackathon deadline**:
1. Repair Railway live URL while preserving same hostname and rollback; bring GitHub `main` client features truly online. Regression-test all assets, UI interactions, mobile responsiveness and `/health`. Keep public mint off.
2. Correct stale documentation that says "no contract deployed" by distinguishing *testnet deployed, mainnet not deployed*. Fix existing minor typo in `docs/TESTNET-DEPLOYMENT-2026-10-10.md`: literal stray `\tokenURI`. Keep all evidence reproducible.
3. Review contract deployment bytecode/build provenance; arrange independent Solidity security assessment and a separate production wallet. Consider whether to do a controlled second testnet demonstration of authenticated art metadata once an actual oracle signature is available. Do not pretend one exists.
4. Execute **one real IMD multi-agent task** with an agreed constrained spec and recoverable payment receipt. Save real job/seat IDs, accepted work hashes, reviews, judge outcomes and public URLs. Critically assess whether review seats are independent and whether results can be anchored to an objectively checkable policy.
5. Precommit an exact `SwarmScoreRegistry` manifest root and `ProofCanvas` oracle claim in proper chronological order, secure **authentic project-specific native IMD Oracle v2** signature with correct consumer/chain/question/quorum, accept receipt onchain and finalize score. Produce a verifiable before-and-after `tokenURI`/SVG change. If protocol cannot supply a valid signer or consumer-bound signature, disclose the limitation and do NOT spoof it.
6. Resolve production chain, contract deployment route and especially **deployer vs owner** for Radar prizes. Radar form says if a contract address is supplied, the payout goes to the **contract deployer**, which may differ from user/controller under an IMD factory. Check with organizers before including contract. Mainnet security audit, source verification and safe owner settings are separate gates; do not open mint prematurely.
7. Create dedicated project **X account** (suggested `@ProofOfWork256`, availability not verified). Make a polished pinned post, upload 2-3 authentic demo screenshots and a short explainer video; avoid hashtags/emojis, exaggeration or financial promises. Personal X optional; project X required for form.
8. Prepare a 60–90 second honest demo: (a) captivating concept and collectible art, (b) running interactive site, (c) actual testnet mint tx + tokenURI, (d) authentic IMD job record and oracle-driven evolution **only once obtained**, (e) why proof matters. Capture GitHub commit/tests and contract explorer links.
9. Submit ONE project entry through https://www.imdradar.site/hackathon. The form currently asks required X project handle, optional personal account, optional Ethereum/Base/Robinhood main contract address, 20–1000 character description, and public consent. **Entry is public and cannot be self-edited**. The main contract field is optional. Preserve the resulting public listing and screenshot as proof; never claim submission before it exists.
10. Confirm the organizer's exact Oct 21 cutoff/time zone; the Radar page is a community collector of entries and says rules/dates are set by organizers.

**P1, after genuine IMD proof**:
- **THE GAUNTLET:** independently adversarially attack an artifact, verify a real defect, independently repair, map accepted outcomes to permanent aesthetic scar vs gold seam. Existing panel dissent is NOT defect proof.
- **PROOF OF CAUSALITY:** every geometrical mark hyperlinks deterministically to exact onchain event, verified work content hash and provenance, replayable by independent verifier. No "role" guess presented as fact.
- **THE WITNESS:** public real-time accepted IMD agent records rather than fictional internal thoughts, explicit pending / failed / judged / authenticated states.
- **GHOST TIMELINES:** two genuine independently developed future branches with predeclared comparison rubric, preserve losing branch as verifiable archival alternative, collector chooses among valid proposals.
- **SYMBIOSIS / SWARM//TWINS:** two-owner joint work + signed IMD receipt actually creates linked features on two NFTs, shared root and explorable paired view without custody handoff.

**P2, post-hackathon expansion**:
- **THE LAST TRIAL:** one-time fully evidenced final challenge with independently audited graduation/monument rules.
- **THE LIVING CIVILIZATION:** real 256-node society of verifiable collaborations, deterministic event-derived shared landscape, authentic history rewind and reproducible state.
- **THE MULTIVERSE:** genuine forked timelines, competing agent-authored canon, irreversible curator choices and archive commitments.
- Consider multi-agent competition + Critic/Adversary pools, procedural sculptures, cinematic replays from accepted event logs, collector scorecards for work quality (never "made up" success probabilities), decentralized artifact pinning, and proof-of-causal-render SDK. Scope aggressively; do not let features displace actual release.

## 7. Submission copy (accurate TEMPLATE, revise after IMD proof)
**Project name:** PROOF//OF//WORK — THE 256.

**Draft under 1,000 characters**:
"PROOF//OF//WORK — THE 256 is an experimental ERC-721 generative-art system in which an artwork's evolution can be tied to inspectable AI-agent work, rather than an unverifiable marketing claim. Four visual grammars — Orbit, Vessel, Lattice and Fracture — make 256 distinct Genesis canvases. A SwarmScoreRegistry commits role-specific work manifests and requires a matching signed native IMD Oracle v2 receipt before finalization; a multi-owner collaboration layer can connect canvases into a shared world. Both Solidity contracts have been deployed and tested on Robinhood Chain Testnet; Genesis #1 was minted and its inline SVG verified. A cinematic gallery previews competing futures and an emerging civilization. Testnet evidence and public source: https://github.com/enstest1/proof-of-work-256 ."

**Do not claim an actual oracle-backed artwork evolution or live IMD agent participation until the P0 jobs/receipts exist.** Update the draft with mainnet provenance only once verified, and submit only after ensuring one project entry and payout mechanics are correct. Radar rules and form: https://www.imdradar.site/hackathon

## 8. Midjourney MCP application (SEPARATE track — not hackathon)
Application URL: https://midjourney.typeform.com/to/iIfEOfZ1 . The earlier draft proposes participation as an independent generative-art experimenter investigating multiple AI creative agents, competing alternate designs, cinematic worlds, reproducible mathematical art and human/AI critique. Explain that testing the MCP is **non-SaaS personal artistic research**, not an automated image-sales wrapper; disclose genuine project status and do not call conceptual agents real. **Application not confirmed submitted**. This is nice-to-have, not a blocker to IMD Radar.

## 9. Honest "definition of done"
- Website production URL loads ALL current assets and passes Chrome desktop/mobile.
- No production secrets leaked. Tests green. Independent security assessment addresses critical release paths.
- Real IMD accepted tasks + public reviewer/job evidence exist.
- At least one exact valid contract-bound native IMD v2 attestation accepted, provenance precommitted, Swarm Score finalized; reproducible artwork evolution demonstrated.
- Mainnet deployment (if doing it) audited, source verified, own/deployer roles and prize handling resolved; mint policy deliberate.
- Dedicated project X account live and submission form has a confirmed public entry.
- A truthful demo and one consistent set of addresses, URLs, screenshots, checksums and public release notes.

## 10. First command/action in new chat
1. Inspect current repository `main`, read this handoff plus `docs/TESTNET-DEPLOYMENT-2026-10-10.md` and `docs/CONCEPT-ROADMAP.md`.
2. Check Railway function logs and current public HTTP assets, especially `/art-studio.js` and `#atelier`. Fix the deploy strategy WITHOUT losing the URL; record rollback, then smoke-test.
3. Audit true onchain testnet transaction receipts, balances, mint closed status and registry link.
4. Continue concrete P0 IMD-backed engineering and submission preparations. If blocked by a signed paid wallet action or X account creation, spell out exactly the one human-only action. DO NOT ask user to refurnish repo links, test wallet address or what was done; that is all above.

**Absolute honesty:** testnet deployment + one test NFT **is real**; an authenticated paid IMD project job, production oracle-driven mutation, mainnet launch, project X account, and IMD Radar submission are **not yet confirmed**.