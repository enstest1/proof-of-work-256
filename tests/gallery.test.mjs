import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
const js=readFileSync(new URL('../web/app.js',import.meta.url),'utf8');
const html=readFileSync(new URL('../web/index.html',import.meta.url),'utf8');
test('256 entries and exactly four archetypes configured',()=>{assert.match(js,/length:256/);assert.match(js,/ORBIT.*VESSEL.*CROWN.*FRACTURE/)});
test('explicit demo warnings exist',()=>{assert.match(html,/SIMULATED DATA/);assert.match(js,/no real IMD proof was submitted/i)});
test('no secret keys present in frontend',()=>{assert.doesNotMatch(js,/PRIVATE_KEY\s*=|sk-or-v1-/)});
test('all expected page sections exist',()=>{for(const id of ['collection','protocol','convergence','manifesto'])assert.match(html,new RegExp(`id="${id}"`))});
