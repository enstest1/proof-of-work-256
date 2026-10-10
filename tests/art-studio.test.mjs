import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const sandbox={module:{exports:{}}};
runInNewContext(readFileSync(new URL('../web/art-studio.js',import.meta.url),'utf8'),sandbox,{timeout:5000});
const a=sandbox.module.exports;
const html=readFileSync(new URL('../web/index.html',import.meta.url),'utf8');
test('five distinct mathematical artistic grammars with standalone source',()=>{
 assert.equal(a.kinds.length,5);
 const images=a.kinds.map((style,id)=>a.atelier({style,id:id+1}));
 assert.equal(new Set(images).size,5);for(const s of images){assert.match(s,/^<svg /);assert.match(s,/<\/svg>$/);assert.ok(s.length>12000);}
});
test('deterministic, bounded DNA inputs',()=>{
 const p={style:'ORBIT',id:42,branch:'A',proofs:4,dissent:2};assert.equal(a.atelier(p),a.atelier(p));
 assert.notEqual(a.atelier({...p,proofs:5}),a.atelier(p));assert.notEqual(a.atelier({...p,branch:'B'}),a.atelier(p));
 assert.equal(a.params({id:-8}).id,1);assert.equal(a.params({id:1e30}).id,256);assert.equal(a.params({proofs:600}).proofs,24);
});
test('all exports explicitly disclose that art is a study',()=>{
 for(const kind of a.kinds){const s=a.social({id:42,style:kind});assert.match(s,/viewBox="0 0 1080 1350"/);assert.match(s,/NOT MINTED/);}
 const guide=a.atelier({style:'FRACTURE',guide:true});assert.match(guide,/fill="#ffffff"/);assert.doesNotMatch(guide,/url\(#halo\)/);
});
test('page includes active studio, five presets, png/svg exports and safe presentation',()=>{
 for(const id of ['atelier','atelier-output','atelier-id','atelier-style','atelier-export-png','atelier-export-svg','atelier-export-guidance','atelier-copy-prompt','atelier-presets'])assert.match(html,new RegExp('id="'+id+'"'));
 assert.match(html,/art-studio.js/);assert.match(html,/NOT MINTED/);
});
test('no AI key or external model call in generator',()=>{
 const s=readFileSync(new URL('../web/art-studio.js',import.meta.url),'utf8');assert.doesNotMatch(s,/openai\.com|api\.replicate|Authorization: Bearer|eth_sendTransaction|PRIVATE_KEY/);
});