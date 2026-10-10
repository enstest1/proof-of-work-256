#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
if ! command -v forge >/dev/null 2>&1; then
  echo 'ERROR: Foundry forge is not installed; contract compilation and tests have NOT run.' >&2
  echo 'Install from https://getfoundry.sh/ then rerun this script.' >&2
  exit 127
fi
if [ ! -e lib/openzeppelin-contracts/contracts/token/ERC721/ERC721.sol ]; then
  forge install --no-commit OpenZeppelin/openzeppelin-contracts@dbb6104ce834628e473d2173bbc9d47f81a9eec3
fi
if [ ! -e lib/forge-std/src/Test.sol ]; then
  forge install --no-commit foundry-rs/forge-std@0258fe875e1d8e207c1eb7175e542ea32356773c
fi
forge --version
forge build --sizes
forge test -vvv
