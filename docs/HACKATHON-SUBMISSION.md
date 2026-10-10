# PROOF//OF//WORK — IMD Hackathon Submission Runbook

**Status: PREVIEW LIVE; NOT SUBMITTED; NO CONTRACT DEPLOYED**  
**Deadline:** October 21, 2026 (per event announcement; verify exact timezone with organizers).

## Verified resources

- Gallery/demo: https://collector-gallery-production.up.railway.app/
- Repository: https://github.com/enstest1/proof-of-work-256 (public source verified; Solidity CI passing)
- Onchain contract: PENDING IMD launch and chain verification
- IMD launch ID: PENDING
- Dedicated project X account: MUST BE CREATED/CONFIRMED
- Submission: https://www.imdradar.site/hackathon

- Solidity CI: https://github.com/enstest1/proof-of-work-256/actions/runs/38027057499

## Project description (less than 1,000 characters)

PROOF//OF//WORK: THE 256 is an ERC-721 generative art protocol built around verifiable AI-agent contribution histories. A capped set of 256 Genesis artworks uses four mathematical visual grammars: Orbit, Vessel, Lattice and Fracture. A Swarm Score precommits four role-specific IMD agent and work references; finalization requires an accepted native IMD Oracle v2 signature for the same evidence root. Signed panel disagreement changes the art. Verified collaboration can connect two canvases, with a maximum of 16 possible Monuments. Public source and 47 passing Solidity tests: https://github.com/enstest1/proof-of-work-256 . Collector preview: https://collector-gallery-production.up.railway.app/ .

**DO NOT POST this as fully launched until:** source is public, real IMD launch accepted, contract verified and working, dedicated X account exists, project evidence matches chain state.

## Remaining project-specific steps

1. From https://explorer.imd.fun/launch connect **your wallet** and choose *custom contracts*; confirm the free preflight result against mainnet 4663. Never enter or send seed phrases or private keys.
2. Carefully review the IMD quote. The API currently lists 0.5 IMD for `launch.open` on Ethereum mainnet payment rails; wallet approval and any required ETH fees are separate. Pay only when you accept the exact contract type, chain and terms; record IMD job/launch ID.
3. Verify resulting contract(s) independently on Robinhood Chain or Ethereum mainnet. Confirm ownership, mintOpen false, legacyProofsEnabled false, source/bytecode and real attestor policy; perform authentic signed IMD work-to-art verification. If builders generated materially different source, rerun audit/tests; **do not claim it is the Stage 5-tested bytecode**.
4. Update `web/deployment.json` only after verifying deployed address, chain and mint settings; do not open mint until audit and collector-fairness review pass.
5. Create a **dedicated** X account for the project and publish public demo/proof links.
6. Submit ONCE through https://www.imdradar.site/hackathon . Form asks for project X handle (required), personal X (optional), main contract (optional), about-project summary and public-visibility checkbox. If including a contract, the page says prizes are paid to its deployer. Confirm ownership before submission.
7. Archive public proof of submission/entry on Radar plus transaction hashes, job IDs, code commit, deployment manifest, and actual agent-work receipts.

## Critical disclosure

The Railway site is a gallery DEMO, not an onchain mint. Its SVG preview is not byte-for-byte identical with `ProofCanvas.svgOf`, and Genesis DNA allocation is deterministic by token ID, not unbiased randomness. A full public collector mint requires art parity, fairness review, security review and an authentic deployment-bound IMD oracle test. Unit/fuzz tests alone do not provide an independent audit.

## Prize-deployer address caveat (must resolve before entering contract)

Radar states that if a contract address is supplied, prizes are paid to the wallet that **deployed the contract**. The official IMD docs list a common factory launch deployer wallet (`0xcecc29b037f5064fcdf45a5c318f132ef76aa551`). If the eventual NFT is deployed by the protocol/factory rather than the entrant's own wallet, do not assume that any prize can reach the entrant. Before entering a contract address, verify the transaction's actual creator on-chain and clarify the payout route with @imdradar and hackathon organizers. Never substitute an owner address for a deployer address or misrepresent contract ownership. The form permits leaving the contract address blank.

## October 9 engineering gate verification

- **Main source import:** IMD `requests/import` returned `ok: true` for the root Foundry source commit `9ce4f62bf5d14e5801a2bcbe0289bc7ccd278b7c` (before subsequent documentation-only commits).
- **Launch pricing and policy:** A real unpaid `requests/quote` returned `quoted` at `0.5 IMD` for an `evm_contracts` launch on Robinhood Chain 4663 with a mandatory `audit-imported-code` first step. This is **not** a paid/admitted or completed launch.
- **Local execution:** Both contracts deployed successfully to a fake-money Anvil simulator configured to chain ID 4663. The addresses are local-development only, NEVER submission addresses.
- **Security tests:** Foundry 47/47 passing, including source-chain receipt matching; independent CI passed on the hardened code; 12 website JS tests passed. No external audit or authenticated project-specific real IMD oracle job was completed.
- **Required user-controlled actions:** dedicated project X account, wallet-signed fee approval for a qualifying IMD launch/real oracle request. Verify actual owner and deployer payout with organizers before inserting an address. Submit only after genuine IMD launch proof exists.
