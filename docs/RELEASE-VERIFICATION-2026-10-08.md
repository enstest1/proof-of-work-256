# PROOF//OF//WORK — Stage 5 reproducible verification

**Date:** 2026-10-08 (UTC). **Release status:** TESTED CODE CANDIDATE, **NOT APPROVED FOR PUBLIC MINT OR MAINNET DEPLOYMENT**.

## Toolchain and executed commands

Executed on an authorized Windows development machine with Foundry **1.8.5**, Solc **0.8.24**, OpenZeppelin **5.0.2** (**dbb6104ce834628e473d2173bbc9d47f81a9eec3**), forge-std **0258fe875e1d8e207c1eb7175e542ea32356773c**. Compiler settings: optimizer enabled (200 runs), `via_ir = true`.

```powershell
cd C:\Users\tomic\Desktop\pow-solidity-audit-isolated\contracts
..\bin\forge.exe build --sizes --skip test
..\bin\forge.exe test -vv --fuzz-runs 1024 --summary
```

**Result:** `forge build` successful; `ProofCanvas` runtime **19,151 bytes** (EIP-170 ceiling 24,576); final complete Foundry run **40 passed, 0 failed, 0 skipped** across six test suites. Five Solidity fuzz tests each executed **1,024 runs** (5,120 fuzz iterations total).

Test suites:

- `ProofCanvasTest`: 5 passing
- `AdversarialTest`: 13 passing
- `IMDOracleV2Test`: 13 passing
- `AdditionalFuzzTest`: 5 passing
- `LiveIMDFixtureTest`: 1 passing
- `MonumentAndReceiverTest`: 3 passing

Also ran `node --test tests/*.test.mjs`: **10 passed, 0 failed**. `node --check web/app.js` and `node --check web/chain.js` passed.

## Changes actually made

1. **Transfer-generation invalidation**: `ownershipEpoch[tokenId]` increments on owner changes; pending oracle claims and two-owner collaborations bind to recorded epochs. Transferring an NFT away and back cannot reactivate earlier pending approvals. This is regression tested.
2. **Question allowlisting**: only the contract owner can set `approvedOracleQuestions[questionHash]`. Work and collaboration registration require a preapproved exact question. This is a *trusted curator policy*, not permissionless objective proof of work.
3. **Revocable question authorization**: if the curator revokes an approved oracle question after a claim or collaboration is registered, that pending attestation can no longer settle. Two adversarial tests enforce the behavior.
4. **Permanent legacy-bridge shutdown**: owner can call `sealLegacyProofs()` to irrevocably disable project-controlled legacy attestations. Oracle v2 pathway is the intended production pathway. The function is available but **has not been called on a deployed contract**, since no contract has been deployed.
5. **Signed oracle testing**: EIP-712 v2 struct, expiry, boolean answer, quorum, chain, question hash, source timestamp, request reuse, signer, and collaboration consent were tested.
6. **Monument integration**: tested the four archetypes, a qualifying proof on each, all six distinct collaboration edges, archival immutability, and one Monument creation. Tests using legacy proofs explicitly enable the legacy path solely in a local simulated environment, *not* production.
7. **Receiver reentrancy**: test confirms an ERC-721 receiver cannot reenter mint to bypass the per-wallet cap.

## Real IMD oracle signature fixture

Fetched a public, already-issued oracle v2 attestation from:

`https://api.imd.fun/oracle/requests/2509431b-cb09-40b4-9784-4ab61c7db9cb/attestation`

- Signed domain: `IdentityMD Oracle`, version `2`, chain `4663`, `verifyingContract=0x265C541aA5C5f202e1e3024570CB7d8B278cA691`.
- EIP-712 verification in ethers.js recovered `0x5598Aa9146215Bc13eb26f2c692Ad1461Fd32982`, matching the public response.
- The pinned signed tuple was reproduced with a Solidity test using `IMDOracleV2.recover`, and the test **passed**.

**Boundary:** the public fixture is *not* an attestation requested by this project. It does not show IMD accepting our future contract as a registered consumer, nor establish a paid live IMD job → real art mutation. It demonstrates cryptographic payload format compatibility only.

## Additional tool observations

- `forge build --sizes` completed with lint warnings: event-order/reentrancy signals around safe ERC721 receiver callbacks, `uint64` casts of timestamps, timestamp comparisons, uninitialized local (which Solidity zero-initializes), and dynamic `abi.encodePacked` use in SVG string concatenation. No release-blocking EIP-170 runtime-size failure was observed. These warnings have **not** been independently adjudicated by a professional auditor.
- `forge coverage --report summary` **did not complete** because disabling via-IR caused a stack-too-deep error in the 15-field IMD v2 attestation encoder. `--ir-minimum` also failed with a Yul stack error. **No coverage percentage is claimed.** The normal optimized via-IR compilation and tests passed.
- No external audit, full formal verification, mainnet fork test, source verification on a block explorer, or funded mainnet/testnet deployment was performed. An attempted `forge script script/Deploy.s.sol:Deploy` dry run on the connected Windows machine exited with a generic OS path error; deployment-script execution has NOT been validated and remains an explicit release gate.

## Hard release gates still pending

1. **Security signoff:** independent review of owner controls, signer rotation, receiver callback/event ordering, gas & metadata size at the 48-node cap, Monad/Robinhood/Ethereum RPC differences, and Monument rules; include a documented fuzz/invariant campaign with provenance.
2. **Authentic consumer binding:** successfully submit a real oracle question scoped to this contract's exact deployed address and configured chain; the contract must accept a live issued signature and reject its reuse.
3. **IMD launch qualification:** pass free `requests/check` against actual deployment parameters; then complete the qualifying `launch.open` flow with wallet authorization, verify transaction receipts and record the IMD launch ID.
4. **Production admin:** authenticated IMD signer address, multisig owner, `sealLegacyProofs()` executed and verified, approved question policy and mint parameters published; genesis artwork/fairness rules finalized.
5. **User experience:** static gallery is a simulated preview and its artwork engine does not equal the onchain renderer. Before public mint, the gallery must use real tokenURI/contract state, display truthfully recorded provenance, and have a mint UX audited for funds and wallet safety.
6. **Project submission:** dedicated X account, public repository, hosting, documented reproducible demo, and submission to Radar; none is claimed complete here.

**No actual wallet transactions, paid IMD requests, mainnet minting or public smart-contract deployment were made during this verification.**

## Reproduce in a fresh environment

```bash
cd contracts
forge install --no-commit OpenZeppelin/openzeppelin-contracts@dbb6104ce834628e473d2173bbc9d47f81a9eec3
forge install --no-commit foundry-rs/forge-std@0258fe875e1d8e207c1eb7175e542ea32356773c
forge build --sizes
forge test --fuzz-runs 1024 --summary
```

For reproducibility, preserve the exact dependency commits and compiler settings in a source-controlled lock/README; the run used the exact OpenZeppelin and forge-std commit hashes shown above. Run CI against pinned versions before public release.
