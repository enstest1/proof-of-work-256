import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
const js=readFileSync(new URL('../web/app.js',import.meta.url),'utf8');
const html=readFileSync(new URL('../web/index.html',import.meta.url),'utf8');
test('256 entries and exactly four archetypes configured',()=>{assert.match(js,/length:256/);assert.match(js,/ORBIT.*VESSEL.*LATTICE.*FRACTURE/)});
test('explicit demo warnings exist',()=>{assert.match(html,/SIMULATED DATA/);assert.match(js,/no real IMD proof was submitted/i)});
test('no secret keys present in frontend',()=>{assert.doesNotMatch(js,/PRIVATE_KEY\s*=|sk-or-v1-/)});
test('all expected page sections exist',()=>{for(const id of ['collection','protocol','convergence','manifesto'])assert.match(html,new RegExp(`id="${id}"`))});

test('swarm metrics are read-only and explicitly not minted proofs',()=>{const h=readFileSync(new URL('../web/index.html',import.meta.url),'utf8');const s=readFileSync(new URL('../web/swarm.js',import.meta.url),'utf8');assert.match(h,/id="swarm"/);assert.match(h,/not minted proofs/i);assert.match(s,/No individual work attestation implied/)});
test('art has four separate visual geometry branches and a dissent layer',()=>{assert.match(js,/kind===0/);assert.match(js,/kind===1/);assert.match(js,/kind===2/);assert.match(js,/FRACTURE/);assert.match(js,/if\(dissent>0\)/)});

test('redesigned hero does not initialize a removed button handler',()=>{assert.doesNotMatch(js,/els\('heroEvolve'\)/);assert.match(html,/href="#trial"/);});
