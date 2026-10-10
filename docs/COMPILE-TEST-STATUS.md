# Compile / test verification — October 7, 2026

## Unambiguous status

- Solidity compiler (solc): **NOT AVAILABLE** in the container at time of assessment.
- Foundry `forge`: **NOT AVAILABLE** in the container at time of assessment.
- OpenZeppelin and forge-std dependency directories: **ABSENT** in the supplied Stage 2 ZIP.
- External download attempts from this container: **BLOCKED BY NETWORK / DNS**.
- Connected Windows development machine: **TIMEOUT** during commands; remote Solidity build unverified.
- `forge build` / `forge test`: **NOT EXECUTED**. Thus the Solidity contracts are NOT verified to compile and the Solidity unit test outcome is UNKNOWN.
- Node.js website-side tests: **10/10 PASSED** (these examine UI and source text, not Solidity execution).
- `node --check web/app.js`: **PASS**.
- `node --check web/chain.js`: **PASS**.

## How to perform an actual Solidity build

In a terminal with Foundry installed, extract the ZIP and run:

```bash
cd proof-of-work/contracts
./test-foundry.sh
```

On Windows PowerShell:

```powershell
cd proof-of-work/contracts
.\test-foundry.ps1
```

The scripts install OpenZeppelin v5.0.2 and forge-std v1.9.7, compile Solidity 0.8.24 with `via_ir = true`, and execute the Foundry tests. A GitHub Actions workflow performs the same verification when the source is committed to a GitHub repository.

## Pre-deployment caution

Do not deploy or open minting before actual passing Solidity compilation, tests and a review. The EIP-712 domain and trusted signer path also require verification using one genuine IMD attestation; signing local test attestations alone does not establish IMD interoperability. Current Source Stage 2 package is preserved and unmodified; this is a separate verifier-prepared copy.
