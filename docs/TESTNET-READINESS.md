# Robinhood Chain testnet — isolated release gate

**Network:** Robinhood Chain Testnet, chain ID 46630, native gas token ETH.  
**Official read-only RPC:** https://rpc.testnet.chain.robinhood.com  
**Explorer:** https://explorer.testnet.chain.robinhood.com  
**Official faucet:** https://faucet.testnet.chain.robinhood.com

The testnet network check is independent of IdentityMD's paid launch. A testnet deployment does **not** satisfy the IMD Radar qualifying mainnet launch requirement. Do not claim otherwise.

## Completed without a signing wallet
1. Root-level Foundry source and 47 preexisting Solidity tests remain unchanged; the Civilization UI only adds new client modules.
2. `node scripts/testnet-preflight.mjs` reads chain ID, latest block and a code query from the real official testnet RPC. The GitHub Actions workflow checks `46630` and publishes its logs.
3. `forge script script/DeployTestnet.s.sol:DeployTestnet --rpc-url https://rpc.testnet.chain.robinhood.com --sender 0x000000000000000000000000000000000000bEEF -vv` simulates an EVM constructor and matching SwarmScoreRegistry from a throwaway **public** address without `--broadcast`. Required environment: `PROOF_OWNER=0x000000000000000000000000000000000000bEEF`. The public testnet RPC may rate-limit simulations; CI reports that separately from the standard 47-test suite.
4. The Railway frontend offers a read-only `/api/testnet` diagnostic that states when the RPC responds, without implying the NFT is deployed or owned.

## Next step requiring a real testnet transaction
A verified external testnet deployment requires **test ETH** for gas and access to a dedicated funded test wallet, preferably a separate Foundry encrypted keystore (not the user's existing mainnet wallet). The faucet requires an authenticated user interaction; do not put a key or recovery phrase in chat, GitHub, Railway or command history.

After the test wallet is funded, perform exactly one controlled transaction to deploy `ProofCanvas` and one to deploy `SwarmScoreRegistry`; verify source/bytecode at the official explorer and immediately check:
- Contract owner equals the intended address; registry.canvas points to ProofCanvas.
- `mintOpen() == false` and `legacyProofsEnabled() == false`.
- Native oracle signer and question approval are **not** misrepresented as live IMD production attestations.
- No initial Genesis tokens minted; free-mint policy, expiry, replay and transfer-epoch tests still pass.
- Testnet deployment manifest is separate from mainnet `web/deployment.json`; keep that production manifest `deployed: false` until a real independent authenticated mainnet deployment is verified.

## Rollback
The public gallery remains on Railway with the original onchain/mint manifest unchanged. The GitHub release branch has PR review and 47 Solidity regression tests. If the new client UI fails, restore the previous Railway function source from its historical deployment or GitHub's pinned v5 commit; no contract state changed in this feature branch.

## Anti-hype rule
The five Civilization eras, hypothetical relationships, Gauntlet scars and proposed Masterworks are illustrations. The only way to mark a relationship verified is to bind an immutable onchain `Collaboration` log to an accepted native IMD oracle receipt, with a verifiable job/work evidence policy; arbitrary offchain JSON and self-asserted role names never suffice.
