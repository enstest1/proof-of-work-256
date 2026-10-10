# October 8, 2026 — Verification status

## Executed

- `node --test tests/*.test.mjs`: **10 passed, 0 failed**.
- `node --check web/app.js`: **passed**.
- `node --check web/chain.js`: **passed**.
- Remote Windows machine: Solidity compiler dependencies installed in isolated `pow-solidity-audit-isolated`, **but full source was not transferred and compiled**.

## NOT executed / NOT passed

- `forge build --sizes` — no Foundry toolchain in the container; desktop source transfer not completed.
- `forge test -vvv` — **not run**.
- Live IMD v2 attestation signature fixture — **not validated**.
- Fork integration, fuzzing and invariant tests — **not run**.
- Deployment, source verification, public mint, actual IMD payment and hackathon submission — **not run**.

## Critical adversarial test added

`contracts/test/Adversarial.t.sol` includes `testCriticalTransferAwayAndBackMustInvalidateClaim`.
The original contract only checks `ownerOf(id) == collectorAtCommit`. If the NFT transfers from Alice to Bob and back to Alice, a stale claim can still succeed. The regression test deliberately expects failure until an ownership epoch / claim-generation invalidation mechanism is implemented. **Do not regard the suite as green before this test passes.**

## Other identified blockers

- Oracle typed-data `verifyingContract` and domain values are assumptions until compared with a real IMD-signed fixture.
- No independent security audit.
- The SVG collection preview and onchain renderer are visually different.
- Genesis DNA is deterministic and lacks a mint-fairness commitment / randomness procedure.

**Release gate: FAIL — mint must remain closed, do not deploy with real funds.**
