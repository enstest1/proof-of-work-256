import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const source=readFileSync(new URL('../web/civilization.js',import.meta.url),'utf8');
const page=readFileSync(new URL('../web/index.html',import.meta.url),'utf8');
const sandbox={module:{exports:{}}};runInNewContext(source,sandbox,{timeout:2000});
const {nodes,cultures,eras,edges,world,render}=sandbox.module.exports;
test('256 unique identities divided equally into four civilizations',()=>{
 assert.equal(nodes.length,256);assert.equal(new Set(nodes.map(n=>n.id)).size,256);
 assert.equal(cultures.length,4);
 for(let i=0;i<4;i++)assert.equal(nodes.filter(n=>n.culture===i).length,64);
});
test('historical eras are deterministic and explicitly hypothetical',()=>{
 assert.equal(eras.length,5);assert.equal(edges(0).length,0);
 assert.deepEqual(JSON.parse(JSON.stringify(edges(4))),JSON.parse(JSON.stringify(edges(4))));
 assert.ok(edges(4).every(x=>x.verified===false&&x.a!==x.b));
});
test('all four cultures are filterable and all factual edge counts fail closed',()=>{
 for(let c=0;c<4;c++){const s=world({era:4,faction:String(c)});assert.equal(s.nodes.length,64);assert.equal(s.verifiedLinks,0);
 const ids=new Set(s.nodes.map(n=>n.id));assert.ok(s.links.every(x=>ids.has(x.a)&&ids.has(x.b)));}
});
test('concept universe never impersonates an accepted IMD collaboration',()=>{
 const s=render({era:4,selected:42});assert.equal(s,(render({era:4,selected:42})));
 assert.equal((s.match(/class="civil-node"/g)||[]).length,256);
 assert.match(s,/0 VERIFIED LINKS/);assert.match(s,/data-evidence="UNVERIFIED"/);
 assert.doesNotMatch(source,/sendTransaction|eth_sendTransaction|PRIVATE_KEY/);
});
test('the public page includes both flagships, timeline and accurate public roadmap',()=>{
 for(const id of ['commons','roadmap','civilEra','civilFaction','civilEraCount','civilSelected'])assert.match(page,new RegExp('id="'+id+'"'));
 assert.match(page,/PROOF\/\/OF\/\/SURVIVAL/);assert.match(page,/THE LIVING CIVILIZATION/);
 assert.match(page,/Ghost|GHOST|SYM[Bb]IOSIS/);
 assert.match(page,/not financial promises|not guaranteed|not a deployed civilization/i);
 assert.match(page,/civilization\.js/);
});
