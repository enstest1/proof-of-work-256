import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const root=new URL('../web/',import.meta.url);
const html=readFileSync(new URL('index.html',root),'utf8');
const source=readFileSync(new URL('experience.js',root),'utf8');
const css=readFileSync(new URL('styles.css',root),'utf8');
function loadArt(){
 const listeners=new Map();
 const ctx={window:{},document:{addEventListener:(event,fn)=>listeners.set(event,fn)},MouseEvent:class{}};
 vm.runInNewContext(source,ctx,{filename:'experience.js'});
 // The bootstrap publishes pure art/model helpers before attaching to the real document.
 ctx.document.getElementById=()=>null;
 listeners.get('DOMContentLoaded')();
 return ctx.window.ProofWorkTrial;
}
test('experience sections and all controls are present',()=>{
 for(const id of ['trial','trialCanvas','trialCanvasId','trialPlay','trialPhase','trialNotes','xray','xrayDetail','archive','archiveSlider','commons','commonsCanvas','commonsView'])
  assert.match(html,new RegExp(`id="${id}"`));
 assert.match(html,/experience\.js/);
});
test('proposal and evidence claims are visibly separated from verified work',()=>{
 assert.match(html,/INTERACTIVE CONCEPT DEMO/);
 assert.match(html,/does not claim independent agent participation/);
 assert.match(source,/UNVERIFIED PREVIEW/);
 assert.match(source,/no IMD job · no signature · no chain transaction/);
 assert.match(source,/0 CONFIRMED COLLABORATION EDGES/);
});
test('all four grammars are different, deterministic and valid SVG',()=>{
 const api=loadArt();
 for(let k=0;k<4;k++){
  const id=41+k;
  const image=api.art(id,'A',4);
  assert.match(image,/^<svg/);
  assert.match(image,/<\/svg>$/);
  assert.equal(image,api.art(id,'A',4),'must be stable across runs');
  assert.notEqual(image,api.art(id,'B',4),'branches must differ');
  assert.match(image,/data-role="0"/);
  assert.match(image,/data-role="1"/);
  assert.match(image,/data-role="2"/);
  assert.match(image,/data-role="3"/);
  assert.ok(image.length>4000);
 }
});
test('archive stages are distinct and documented as simulated',()=>{
 const api=loadArt();
 const stages=[0,1,2,3,4].map(x=>api.art(42,'A',x));
 assert.equal(new Set(stages).size,5);
 assert.equal(api.getStatus().status,'SIMULATION ONLY');
 assert.equal(api.getStatus().transaction,'NONE');
});
test('CSP-sensitive code avoids adding unsanitized user HTML to inspector',()=>{
 assert.match(source,/target\.replaceChildren\(\)/);
 assert.match(source,/textContent=v/);
 assert.doesNotMatch(source,/innerHTML\s*=.*location\.search/);
 assert.match(css,/prefers-reduced-motion/);
});
