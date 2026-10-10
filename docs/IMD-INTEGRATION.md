# IdentityMD Oracle v2 integration (2026-10-07)

## Native validation implemented
`contracts/src/IMDOracleV2.sol` verifies the full EIP-712 `OracleAttestation` v2 struct including dynamic `answer` hashing, signer recovery and the oracle's own domain (`IdentityMD Oracle`, version `2`, consumer chain ID and `ProofCanvas` address). Source: https://imd.fun/docs/#the-attestation (read the live docs again before production).

`ProofCanvas.registerOracleClaim` records the canvas, evidence hash, source chain, exact expected question hash, category and registration time. Registration is restricted to the token owner. `acceptOracleProof` accepts only a `bool` result of true, source chain and question match, panel size >= 5, quorum >= 4, agreement >= quorum, issued after pre-registration, not expired, current signer, and unused work ID and oracle request ID. Anyone may relay a valid proof. It emits `OracleReceiptVerified` and the normal art update event.

**Strong limitation:** IMD panel agreement is NOT proof of genuine software quality. The collector controls the question submitted to IMD. Work receipt labels and evidence require separately documented admissibility policy. This implementation authenticates IMD's attestation and verifies matching answers; it does not automate subjective work review.

A native collaboration path is also implemented: the owner of the lower-numbered canvas proposes a joint claim, the owner of the higher-numbered canvas confirms it, and an IMD oracle v2 `bool true` signature creates matching history updates on both canvases. The work and oracle request IDs can only be consumed once.

The old project-controlled `acceptProof` remains for backward compatibility but is *disabled by default* using `legacyProofsEnabled = false`. Its signatures must never be presented as native IMD oracle signatures.

## Signer and consumer configuration

1. Deploy onto a chain listed in `GET https://api.imd.fun/requests/capabilities`.
2. Retrieve the current IMD oracle attester from the verified IMD API / oracle infrastructure and compare it with official documentation. The owner calls `setOracleSigner` with that authenticated address. **Never guess the signer.**
3. After deployment, build a precisely scoped question that commits to an independently retrievable evidence manifest and objective result. Configure `consumer` as `{chainId: <deployment chain>, verifyingContract: <actual ProofCanvas address>}`. The EIP-712 consumer address must match the one onchain.
4. Before the oracle issues its signature, mint a canvas and call `registerOracleClaim` using the expected question hash (derived from IMD's canonical question serialization). Timestamp ordering is enforced.
5. Use IMD's free `requests/check` endpoint with the oracle question. Only after it passes may a wallet pay 0.5 IMD to open the request.
6. Fetch `/oracle/requests/:id/attestation` and confirm `domain`, `types`, `primaryType`, `message`, `signature`, `signer`. Compare recovered signer and the expected question hash offline.
7. Relay the exact v2 tuple and signature to `acceptOracleProof`; confirm onchain `WorkAccepted`, `OracleReceiptVerified`, changed `tokenURI` and replay rejection.

Because no funded oracle job and signed production attestation were available in this run, the above is implementation and test scaffolding. An end-to-end production IMD job → signed oracle → onchain execution remains unverified.

## Free IMD deployment preflight findings
The current `launches.chains` advertises `evm_contracts` on Sepolia (11155111), Ethereum (1), and Robinhood Chain (4663). Base is not listed. Initial NFT-only checks returned token metadata blockers. A third, more precise `launch.open` preflight described the ERC-721 name, symbol, cap and required test paths: it returned **zero blockers**, `kind: contracts`, and a build/test/audit/Sepolia deploy plan. It still warned that unspecified details may be interpreted by builders. No payment or chain deployment occurred; actual source compilation/security review and signed wallet approval remain required. Consult `docs/imd-preflight-result.json`.

## Trust assumptions and rollback
Owner controls the oracle signer and the ability to open the mint. Recommend a timelocked multisig owner for production. The oracle signer should be pinned from an authenticated source and rotated when IMD rotates it. Already accepted records remain committed; pending old attestations won't verify after rotation. Do not describe the proof policy as permissionless or decentralized beyond its verifiable signed attestations.
