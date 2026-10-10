# Production and hackathon release gate

## Stage A: Readiness
- [ ] Install and pin Foundry dependencies, compile contracts, pass full tests
- [ ] Security review; fuzz tests and invariant tests including collaboration/monument edge cases
- [ ] Make frontend renderer consistent with authoritative contract `tokenURI` output
- [ ] Replace predictable Genesis allocation if collector-facing fairness requires it
- [ ] Add live wallet write actions and test on target testnet
- [ ] Integrate real IMD verified evidence receipts and provenance links
- [ ] Verify oracle signature policy and replay boundaries with fixtures
- [ ] Check IMD launch capability for NFT project; resolve token/pool requirement
- [ ] Establish user-controlled deployer wallet, multisig attestor and metadata commitments

## Stage B: Launch
- [ ] Deploy via supported IMD workflow, retaining onchain and IMD launch evidence
- [ ] Verify contract on explorer
- [ ] Flip mintOpen only after final audit and deploy checks
- [ ] Deploy frontend to HTTPS domain and verify all external evidence links
- [ ] Confirm real mint/proof/freeze/collaboration event against chain state
- [ ] Create project X account and publish explainer/demo
- [ ] Submit site, source, IMD launch ID, chain contract address, evidence, video to imdradar.site/hackathon by October 21, 2026

## Stage C: Smoke test
- [ ] Home and mobile gallery render
- [ ] Wallet connect and chain switch
- [ ] Mint in correct chain and one-wallet rule
- [ ] Signed proof increments only once
- [ ] Wrong signer / expired / wrong canvas / cross-chain rejected
- [ ] Collaboration requires independent evidence and both agent roles
- [ ] Freeze permanent; monument requires six collaboration edges and distinct archetypes
- [ ] Repeated tokenURI calls yield identical output for unchanged state

## Rollback
Contracts are immutable. Rollback can only disable front-end deployment, rotate trusted attestor, and pause new mints; **existing collector tokens cannot be rewritten**. Stage low stakes first and do not deploy until the tests and threat model pass.
