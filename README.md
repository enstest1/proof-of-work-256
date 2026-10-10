# PROOF//OF//WORK — THE 256

**Tested engineering candidate · October 9, 2026 · Public demo live · No onchain mint**

A collector-first generative art experiment with a Solidity contract for 256 Genesis canvases, attested work receipts, collaboration edges, irreversible freeze, and a 16-Monument ceiling. Includes a responsive self-contained gallery prototype and a Foundry test suite.

**Public collector preview:** https://collector-gallery-production.up.railway.app/ (simulated collection; contract and mint still inactive).

**Repository:** https://github.com/enstest1/proof-of-work-256 (pending first push).

**Hackathon submission guide:** [docs/HACKATHON-SUBMISSION.md](docs/HACKATHON-SUBMISSION.md).

## Exact project status

| Component | Status |
|---|---|
| Collector website, 256-piece generative SVG preview, responsive layouts, filters, interactive canvas details | Implemented; browser demo uses mock data |
| Wallet connection | EIP-1193 account connect only; no live minting |
| ERC-721 ProofCanvas contract | Compiles with Solidity 0.8.24; 40/40 Foundry tests passed, independent audit still required |
| One-mint-per-wallet and fixed Genesis cap | Passing local Foundry tests; not deployed onchain |
| Signed work receipts with EIP-712 domain and replay protections | Legacy path disabled by default; native IMD v2 pathway tested with public signed fixture |
| Signed collaboration, freeze, four-parent monuments | Local integration and adversarial tests passing |
| Native IMD oracle signature validation | Public real issued IMD v2 fixture verified via ethers.js and Solidity test; project-specific paid consumer path still unverified |
| Real live agent jobs, cryptographic evidence manifests | NOT integrated |
| IMD API free launch preflight | Refined NFT-only launch input passed with zero blockers; no quote/payment/deploy attempted |
| IMD protocol launch, deployed contract, website production URL | NOT performed |
| Dedicated X account and Radar submission | NOT performed |
| Solidity audits | Local lint and adversarial tests performed; NO independent security audit |

**Do not market simulated work events as verified real agent work.** The web demo labels the distinction.

## Run the collector gallery

You can open `web/index.html` directly in a desktop browser. For a local server:

```bash
cd web
python -m http.server 8080
# visit http://localhost:8080
```

This build has no browser-side dependency on wallets or remote databases; the optional Google Fonts request is cosmetic.

## Run tests

```bash
node --test tests/*.test.mjs
# To compile and test the smart contracts, install Foundry first:
cd contracts
forge install --no-commit OpenZeppelin/openzeppelin-contracts@dbb6104ce834628e473d2173bbc9d47f81a9eec3
forge install --no-commit foundry-rs/forge-std@0258fe875e1d8e207c1eb7175e542ea32356773c
forge test --fuzz-runs 1024 --summary
```

## Architecture

- `web/` — collector prototype, simulated artwork state, plus disabled-by-default live tokenURI inspector
- `contracts/src/ProofCanvas.sol` — onchain ERC-721 / proof registry / collaboration and Monument logic
- `contracts/test/` — 40 passing local Foundry tests including fuzz, live IMD signature fixture, Monument and receiver tests
- `docs/SECURITY.md` — threat model and production blockers
- `docs/IMD-INTEGRATION.md` — upstream bridge requirements and launch procedures
- `docs/LAUNCH.md` — preflight and submission checklist

## Critical implementation warning

The Solidity SVG renderer and frontend visual algorithm are **not the same implementation**. Before public mint, unify the art engine or make the onchain one authoritative and have the gallery render `tokenURI` results. Likewise the current genesis `dna` is a deterministic ID hash and **not unbiased random**. Fix both before promoting the public collector preview into a mint sale.

## License

Source provided as a technical project starter. No license is granted for claiming unverified IMD results or security certifications.

## Stage 2 engineering additions (October 7, 2026)

- `contracts/src/IMDOracleV2.sol`: native typed-data v2 digest and signature verification.
- `registerOracleClaim` and `acceptOracleProof`: precommit question and evidence, verify signed true with quorum and replay protection; legacy bridge disabled by default.
- `contracts/test/IMDOracleV2.t.sol`: signature, quorum, registration ordering, wrong question, expiration and replay tests (not executed without Foundry).
- `contracts/script/Deploy.s.sol`: production-safe mint-closed deployment skeleton.
- `web/chain.js`: read-only live token metadata inspector when a verified deployment manifest exists; no simulated work is presented as live.
- `scripts/imd-preflight.mjs`: free launch API check and machine-readable report.
- `docs/imd-preflight-result.json`: the real no-payment launch preflight findings.

### Deployment gate

Do not flip `web/deployment.json` to `deployed:true` until an audited contract is deployed through IMD and its address and explorer/source proof are independently verified. The refined NFT-only IMD free launch check passed, but no IMD payment or actual deployment was made. Compilation/security review and wallet authorization remain mandatory.

## Stage 5 validated build (October 8, 2026)

Foundry 1.8.5 with Solidity 0.8.24 compiled successfully and **40/40 tests passed** (five fuzz cases with 1,024 iterations each). JavaScript tests passed **10/10**. EIP-712 signing format was checked against one **genuine public IMD Oracle v2 attestation**. Ownership-transfer round trips are protected through `ownershipEpoch`, registration requires owner-approved questions, and irreversible disabling of the legacy attestor is available.

This **does not mean mainnet launch ready**: the user-facing gallery remains a simulation, no deployed consumer or paid IMD request exists, source remains unaudited by an independent party, and no chain launch or hackathon submission has been performed. See [`docs/RELEASE-VERIFICATION-2026-10-08.md`](docs/RELEASE-VERIFICATION-2026-10-08.md).
