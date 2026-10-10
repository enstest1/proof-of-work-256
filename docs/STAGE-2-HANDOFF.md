# Engineering checkpoint: October 7, 2026

## Implemented in source
- Native IMD OracleAttestation v2 EIP-712 digest and signer recovery.
- Collector precommit with question hash, evidence hash, source chain, category and created time.
- Replay prevention across both proof and collaboration pathways.
- Panel/quorum/expiry/boolean answer validation.
- Two-owner collaboration consent, native oracle result, and bilateral art evolution.
- Project-controlled legacy attestations and collaborations disabled by default.
- Deployment script defaults to no public mint, no native signer, no legacy trusted proofs.
- Website's read-only tokenURI inspector is separated from clearly labelled simulated art.
- Forge test cases for native signatures, wrong signer/question, precommit ordering, quorum, false, expiry, replay, two-party collaboration and legacy default-off.
- Node/browser-source tests and free IMD launch preflight report.

## Gate failures / explicit remaining work
1. **Not compiled:** Foundry and pinned dependencies unavailable in the artifact container. Foundry tests have been authored but not executed. Do not infer contract safety from Node tests.
2. **API free preflight PASS:** the initial two drafts were blocked, but the refined NFT-only `launch.open` draft now returns zero blockers and an audit+Sepolia plan. This is a check, NOT an admitted paid launch. Source compile, signer and wallet authentication remain before safe production.
3. **No actual oracle request:** No IMD token payment; no live signed v2 attestation bound to the deployed consumer contract.
4. **No deployment or verified address:** Contract owner, secure signer and deployment wallet need explicit configuration; no assets have been minted.
5. **No hosted website or official submission:** `web/deployment.json` intentionally has `deployed:false` and mint actions disabled.
6. **Economic/collector fair mint review:** genesis seeds predictable and free one-per-wallet is not Sybil-proof. Do not advertise fair randomized mint or financial returns.
7. **Work quality trust:** A collector can select an easy true/false oracle question; a signed yes/no response does not necessarily prove useful work. Need an allowlisted work-class taxonomy or verifiable job evidence schema before celebrating the result as earned.
8. **Additional security review needed:** Full fuzz/invariant, gas bound and adversarial review; real tokenURI call and signer rotation tests.

## Suggested priority
1. Install Foundry v1.8.3 and OpenZeppelin 5.x, run `forge build` and `forge test -vvv` with recorded outputs; fix errors.
2. Use the zero-blocker `launch.open` draft in `docs/imd-launch-preflight.json` to ask IMD for a quote only once the contracts compile and the owner approves a wallet spend. Do not alter it to create an ERC-20.
3. Deploy in Sepolia only; call `setOracleSigner` after authenticating signer from official infrastructure.
4. Run a real reproducible IMD question with the exact `consumer` address, register claim before oracle signs, relay signed payload, inspect receipt and SVG onchain.
5. After full security review, select Ethereum / Robinhood and repeat the qualifying IMD launch + demo.

## Rollback
The original archive `proof-of-work-build.zip` is unchanged. This next-stage archive is a separate revision. Never auto-toggle mint in `web/deployment.json` or onchain without audited approval. Onchain storage changes are not reversible by swapping websites.
