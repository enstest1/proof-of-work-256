import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
const chain=readFileSync(new URL('../web/chain.js',import.meta.url),'utf8');
const config=JSON.parse(readFileSync(new URL('../web/deployment.json',import.meta.url),'utf8'));
const html=readFileSync(new URL('../web/index.html',import.meta.url),'utf8');
const sourceRoot=new URL('../src/ProofCanvas.sol',import.meta.url);
const sourceContract=existsSync(sourceRoot)?sourceRoot:new URL('../contracts/src/ProofCanvas.sol',import.meta.url);
const contract=readFileSync(sourceContract,'utf8');
const native=readFileSync(existsSync(new URL('../src/IMDOracleV2.sol',import.meta.url))?new URL('../src/IMDOracleV2.sol',import.meta.url):new URL('../contracts/src/IMDOracleV2.sol',import.meta.url),'utf8');
const readme=readFileSync(new URL('../docs/IMD-INTEGRATION.md',import.meta.url),'utf8');
test('production off by default',()=>{assert.equal(config.deployed,false);assert.equal(config.mintingEnabled,false);assert.equal(config.proofCanvasAddress,null);assert.match(chain,/mint\.disabled=true/)});
test('live and simulation are separate',()=>{assert.match(html,/id="onchain"/);assert.match(html,/SIMULATED DATA/);assert.match(chain,/eth_call/);assert.match(chain,/tokenURI/)});
test('tokenURI decoder bounds URI and image types',()=>{assert.match(chain,/len>500000/);assert.match(chain,/data:image\\\/svg/)});
test('native oracle checks source, quorum, boolean result, replay, registration chronology',()=>{
 for(const word of ['a.questionHash != claim.questionHash','a.chainId != claim.sourceChainId','a.agreed < a.quorum','abi.decode(a.answer, (bool))','consumedOracleRequests[a.requestId]','a.issuedAt < claim.registeredAt','OracleSignatureInvalid'])assert.ok(contract.includes(word),word);
});
test('oracle v2 full EIP712 tuple and dynamic bytes hash is present',()=>{assert.match(native,/OracleAttestation\(bytes32 requestId/);assert.match(native,/keccak256\(a.answer\)/);assert.match(native,/VERSION_HASH = keccak256\("2"\)/)});
test('security limits explicitly documented',()=>{assert.match(readme,/NOT proof of genuine software quality/);assert.match(readme,/No payment or chain deployment/);});
