/* CIVILIZATION v6 / two flagship directions. Preview links are NEVER proof. */
(function(root){
'use strict';
const cultures=Object.freeze([
{name:'ORBIT',role:'DISCOVER',color:'#d9bf8d',about:'Discover questions and map unknown possibilities.'},
{name:'VESSEL',role:'BUILD',color:'#98bed6',about:'Construct useful artifacts and preserve work.'},
{name:'LATTICE',role:'CONNECT',color:'#d1d6cc',about:'Coordinate shared systems and verified collaboration.'},
{name:'FRACTURE',role:'CHALLENGE',color:'#d39399',about:'Challenge weak assumptions and inspire tested repair.'}]);
const eras=[
{name:'GENESIS',desc:'256 isolated artistic identities. No verified collaborations.',count:0},
{name:'FIRST CONTACT',desc:'A hypothetical first collaboration connects two cultures.',count:14},
{name:'THE NETWORK',desc:'Conceptual partnerships grow across the four civilizations.',count:44},
{name:'THE GAUNTLET',desc:'An illustrated challenge creates a scar in the shared landscape.',count:76},
{name:'THE REPAIR',desc:'The imagined world carries its scar and a path to reconstruction.',count:104}
];
function hash(n){let x=(n^0x9e3779b9)>>>0;x=Math.imul(x^(x>>>16),0x85ebca6b);x=Math.imul(x^(x>>>13),0xc2b2ae35);return(x^(x>>>16))>>>0;}
function clamp(n){n=Number(n);return Number.isInteger(n)&&n>=1&&n<=256?n:42;}
const nodes=Array.from({length:256},(_,i)=>{
 const id=i+1,culture=i%4,index=Math.floor(i/4),band=Math.floor(index/16),slot=index%16;
 const a=(culture-.5)*Math.PI/2+(slot+.5)/16*Math.PI/2+band*.045,r=111+band*53+(hash(id*71)%21);
 return Object.freeze({id,culture,x:+(400+Math.cos(a)*r).toFixed(1),y:+(400+Math.sin(a)*r).toFixed(1)});
});
function edges(era){const total=eras[Math.min(4,Math.max(0,Number(era)||0))].count, out=[];for(let i=0;i<total;i++){
 let a=1+hash(i*227+13)%256,b=1+hash(i*541+811)%256;if(a===b)b=b%256+1;
 out.push({a,b,kind:i%11===0?'challenge':i%7===0?'repair':'collaboration',verified:false});
}return out;}
function world({era=0,faction='all',selected=42}={}){
 era=Math.max(0,Math.min(4,Math.round(Number(era)||0)));
 const subset=nodes.filter(n=>faction==='all'||n.culture===Number(faction)),ids=new Set(subset.map(n=>n.id));
 return {era,nodes:subset,links:edges(era).filter(e=>ids.has(e.a)&&ids.has(e.b)),selected:clamp(selected),verifiedLinks:0,simulation:true};
}
function render(opts={}){
 const data=world(opts),byId=new Map(nodes.map(n=>[n.id,n]));
 const paths=data.links.map(e=>{const a=byId.get(e.a),b=byId.get(e.b),c=e.kind==='challenge'?'#d38b88':e.kind==='repair'?'#dfc790':'#9da8bf';
 return '<path d="M '+a.x+' '+a.y+' Q400 400 '+b.x+' '+b.y+'" stroke="'+c+'" stroke-dasharray="2 7" stroke-width=".8" opacity=".35" fill="none" data-evidence="UNVERIFIED"/>';}).join('');
 const dots=data.nodes.map(n=>{const active=n.id===data.selected;return '<g class="civil-node" data-canvas-id="'+n.id+'" tabindex="0" role="button" aria-label="Select Genesis '+n.id+'"><circle cx="'+n.x+'" cy="'+n.y+'" r="'+(active?5:2.3)+'" fill="'+cultures[n.culture].color+'"/>'+(active?'<circle cx="'+n.x+'" cy="'+n.y+'" r="11" stroke="#efdbab" fill="none"/>':'')+'</g>';}).join('');
 const scar=data.era>=3?'<path d="M365 310 L396 338 382 367 414 403 400 430" fill="none" stroke="#cf8b84" stroke-width="2"/>':'';
 const repair=data.era===4?'<path d="M365 310 L396 338 382 367 414 403 400 430" stroke="#e8c88d" fill="none" stroke-width="1.2" stroke-dasharray="3 5"/>':'';
 return '<svg class="civilization-svg" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Civilization era '+(data.era+1)+', a simulation with zero confirmed collaborations"><rect width="800" height="800" fill="#0a0d12"/><circle cx="400" cy="400" r="314" fill="none" stroke="#353d47"/><circle cx="400" cy="400" r="235" fill="none" stroke="#353d47" opacity=".35"/><circle cx="400" cy="400" r="143" fill="none" stroke="#353d47" opacity=".25"/>'+paths+scar+repair+dots+'<circle cx="400" cy="400" r="39" stroke="#b8a077" fill="#10151b"/><text x="400" y="395" text-anchor="middle" fill="#e2ceaa" font-size="13">THE</text><text x="400" y="415" text-anchor="middle" fill="#e2ceaa" font-size="16">256</text><text x="25" y="775" fill="#a5aebb" font-size="10">ILLUSTRATIVE HISTORY / 0 VERIFIED LINKS</text></svg>';
}
function init(doc){
 const el=id=>doc.getElementById(id),host=el('commonsCanvas');if(!host||!el('civilEra'))return;
 const state={era:0,selected:42,faction:'all'};
 function redraw(){
  host.innerHTML=render(state);const period=eras[state.era],culture=cultures[(state.selected-1)%4];
  el('civilEraName').textContent=period.name;el('civilEraDesc').textContent=period.desc;
  el('civilEraCount').textContent=period.count+' hypothetical links / 0 verified';
  el('civilSelected').textContent='GENESIS #'+String(state.selected).padStart(3,'0')+' · '+culture.name;
  el('civilSelectedDetail').textContent=culture.role+' · '+culture.about+' No authenticated work is attributed to this token.';
  el('commonsLegend').textContent='Dashed links are simulations, not accepted IMD proofs or signed collaborations.';
  el('commonsStatus').textContent='CIVILIZATION DEMO · zero verified onchain collaboration events';
  el('civilPrev').disabled=state.era===0;el('civilNext').disabled=state.era===4;
 }
 function select(id){state.selected=clamp(id);redraw();}
 el('civilEra').addEventListener('input',e=>{state.era=+e.target.value;redraw();});
 el('civilFaction').addEventListener('change',e=>{state.faction=e.target.value;redraw();});
 el('civilPrev').addEventListener('click',()=>{state.era=Math.max(0,state.era-1);el('civilEra').value=state.era;redraw();});
 el('civilNext').addEventListener('click',()=>{state.era=Math.min(4,state.era+1);el('civilEra').value=state.era;redraw();});
 host.addEventListener('click',e=>{const node=e.target.closest('[data-canvas-id]');if(node)select(Number(node.dataset.canvasId));});
 host.addEventListener('keydown',e=>{const node=e.target.closest('[data-canvas-id]');if(node&&(e.key==='Enter'||e.key===' ')){e.preventDefault();select(+node.dataset.canvasId);}});
 root.ProofCivilization=Object.freeze({isActive:true,selectCanvas:select,world,eras,cultures});
 redraw();
}
const api=Object.freeze({cultures,eras,nodes,edges,world,render});
if(typeof module!=='undefined'&&module.exports)module.exports=api;
if(root&&root.document)root.document.addEventListener('DOMContentLoaded',()=>init(root.document));
})(typeof window!=='undefined'?window:globalThis);
