$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
if (-not (Get-Command forge -ErrorAction SilentlyContinue)) {
  Write-Error 'Foundry forge is not installed; Solidity compile/tests have NOT run. Install via https://getfoundry.sh/ before executing.'
  exit 127
}
if (-not (Test-Path 'lib/openzeppelin-contracts/contracts/token/ERC721/ERC721.sol')) {
  forge install --no-commit OpenZeppelin/openzeppelin-contracts@dbb6104ce834628e473d2173bbc9d47f81a9eec3
  if ($LASTEXITCODE -ne 0) { throw 'OpenZeppelin install failed' }
}
if (-not (Test-Path 'lib/forge-std/src/Test.sol')) {
  forge install --no-commit foundry-rs/forge-std@0258fe875e1d8e207c1eb7175e542ea32356773c
  if ($LASTEXITCODE -ne 0) { throw 'forge-std install failed' }
}
forge --version
forge build --sizes
if ($LASTEXITCODE -ne 0) { throw 'Solidity compile failed' }
forge test -vvv
if ($LASTEXITCODE -ne 0) { throw 'Solidity tests failed' }
