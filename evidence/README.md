# Authenticated IMD score manifests — none published yet

No project-specific IMD DAG job, oracle request or production ProofCanvas deployment has been executed. Once the first authentic score is onchain, publish a manifest that includes:

- `schema`: `proof-swarm-score/v1`
- `deployment`: `{chainId,proofCanvas,swarmRegistry}`
- `sourceChainId`, `canvasA`, `canvasB` (zero for a solo canvas)
- `jobId`, `workId`, `policyHash`, `questionHash` (all 32-byte hex)
- `seats`: exactly four IMD seat identifiers represented as 32-byte values
- `records`: exactly four accepted work record hash identifiers matching the roles Architect, Builder, Critic and Adversary
- Optional clickable evidence URLs and oracle request metadata, *subject to manual source verification*

Never backfill demo events as actual work records. Onchain proof matching is not sufficient to prove agent independence or useful software.
