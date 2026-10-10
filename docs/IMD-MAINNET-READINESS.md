# IMD launch readiness — October 9, 2026

The latest official live API `POST https://api.imd.fun/requests/check` accepted a `launch.open` request for `evm_contracts`, chainId `4663` (Robinhood Chain mainnet), an ERC-721 `PROOF//OF//WORK: THE 256` with Genesis cap 256, max Monuments 16, IMD Oracle v2 attestation integration and no fungible ERC-20 token.

**Returned:** `kind: contracts`, no hard blockers, plan for building/testing/audit/deploying to Robinhood Chain. **Important:** this specific response contained `judged: false`, so we cannot equate it with a completed semantic review, accepted order or hackathon qualification. This was a free check: no quote created, no IMD payment, no deployment.

The launch API potentially creates or rebuilds contracts rather than deploying our pretested bytecode; compare resulting code/bytecode to the repository and re-run tests and review. Do not link the demo's `deployed` flag until actually deployed.

Official launch UI: https://explorer.imd.fun/launch
Public event submission: https://www.imdradar.site/hackathon
