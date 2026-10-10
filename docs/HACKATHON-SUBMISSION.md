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

- Solidity CI: https://github.com/enstest1/proof-of-work-256/actions/runs/38025530663\n\n## Project description (less than 1,000 characters)

PROOF//OF//WORK: THE 256 makes verified AI-agent contributions collectible. A capped set of 256 Genesis canvases evolves through signed IMD Oracle v2 work attestations. Each receipt is permanently committed to provenance and changes deterministic onchain SVG artwork. Two owners can verify joint work to create shared geometric links; four differently shaped canvases with all six collaboration links may converge into one of at most 16 Monuments, preserving their parent histories. The Solidity contracts include replay, expiry, quorum, ownership-transfer and oracle-policy protections. The gallery reveals the art and the evidence behind it. No ERC-20 token, trading hook or financial promises. Collector preview: https://collector-gallery-production.up.railway.app/ . Code: https://github.com/enstest1/proof-of-work-256 .

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
