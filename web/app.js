/* P//W deterministic collector preview. All work events here are SIMULATED.
   The contract is the canonical source in an actual connected deployment. */
const names=['ORBIT','VESSEL','CROWN','FRACTURE'];
const els=id=>document.getElementById(id);
function hash(n){let a=(n^0x9e3779b9)>>>0;a=Math.imul(a^(a>>>16),0x85ebca6b);a=Math.imul(a^(a>>>13),0xc2b2ae35);return (a^(a>>>16))>>>0}
function rnd(n,s){return hash((n+1)*2654435761+s)/4294967295}
const state=Array.from({length:256},(_,i)=>({id:i+1,kind:i%4,proofs:0,history:[],frozen:false}));
let limit=12,filter='all',sort='id',selected=null,heroProof=0;
function coords(seed,i,kind,layer=0){let theta=2*Math.PI*(i/12+rnd(seed,i+layer*105)*.09),radius=kind===0?108+layer*26:kind===1?90+(i%3)*20+layer*16:kind===2?95+(i%2)*35+layer*17:82+(i%4)*19+layer*15;return [200+Math.cos(theta)*radius,200+Math.sin(theta)*radius]}
function artwork(seed,kind,proofs=0,monument=false){
 const ink=['#d8c190','#b7c8d9','#e5dfd1','#c19c9d'][kind%4],count=12+Math.min(proofs,16)*3;
 let svg=`<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Deterministic generative art"><rect width="400" height="400" fill="#090b0f"/><circle cx="200" cy="200" r="165" stroke="#333943" stroke-width=".5" fill="none"/>`;
 for(let i=0;i<count;i++){let [x,y]=coords(seed,i%12,kind,Math.floor(i/12)),[x2,y2]=coords(seed,(i+3+kind)%12,kind,Math.floor(i/12));let w=(i%7===0)?1.4:.55;svg+=`<path d="M${x.toFixed(1)} ${y.toFixed(1)} Q200 200 ${x2.toFixed(1)} ${y2.toFixed(1)}" stroke="${ink}" stroke-width="${w}" opacity="${i>24?.8:.55}" fill="none"/>`;
 if(i<20||i%3===0)svg+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${i%5===0?3:1.5}" fill="${i%4===0?'#e9e6dc':ink}"/>`;
 }
 if(kind===0)svg+='<circle cx="200" cy="200" r="83" fill="none" stroke="'+ink+'" stroke-width="1"/>';
 if(kind===1)svg+='<path d="M150 150Q200 80 250 150L275 285Q200 325 125 285Z" stroke="'+ink+'" fill="none" stroke-width="1"/>';
 if(kind===2)svg+='<path d="M110 215 L150 115 L200 170 L250 115 L290 215 L270 280 L130 280 Z" fill="none" stroke="'+ink+'" stroke-width="1"/>';
 if(kind===3)svg+='<path d="M205 65 L170 170 L228 203 L165 337" stroke="'+ink+'" fill="none" stroke-width="2"/>';
 svg+='<circle cx="200" cy="200" r="5" fill="#f3e8cc"/>';
 if(monument){for(let k=0;k<4;k++)svg+=`<circle cx="200" cy="200" r="${35+k*31}" stroke="#d5bd8e" stroke-width=".8" fill="none"/>`}
 return svg+'</svg>'
}
function toast(msg){els('toast').textContent=msg;els('toast').classList.add('show');clearTimeout(window._toast);window._toast=setTimeout(()=>els('toast').classList.remove('show'),3600)}
function drawHero(){els('heroCanvas').innerHTML=artwork(1,0,heroProof);els('heroProof').textContent=String(heroProof).padStart(3,'0');els('heroState').textContent=heroProof?'EVOLVING':'GENESIS'}
function card(c){return `<button class="art-card" data-id="${c.id}" aria-label="Open canvas ${c.id}"><div class="card-art">${artwork(c.id,c.kind,c.proofs)}</div><div class="card-footer"><div><div class="card-title">GENESIS #${String(c.id).padStart(3,'0')}</div><div class="card-sub">${names[c.kind]} · ${c.proofs} PROOFS</div></div><span class="card-index">↗</span></div></button>`}
function visible(){let all=state.filter(c=>filter==='all'||c.kind===+filter);if(sort==='proofs')all.sort((a,b)=>b.proofs-a.proofs||a.id-b.id);return all}
function renderGallery(){const all=visible();els('resultCount').textContent=`${all.length} WORKS`;els('gallery').innerHTML=all.slice(0,limit).map(card).join('');els('more').style.display=limit<all.length?'inline-block':'none';document.querySelectorAll('[data-id]').forEach(b=>b.onclick=()=>openDetail(+b.dataset.id))}
function demoHash(c){let x=hash(c.id*11939+c.proofs*3271);return '0x'+Array.from({length:8},(_,i)=>hash(x+i).toString(16).padStart(8,'0')).join('')}
function openDetail(id){selected=id;const c=state[id-1];els('detailTitle').textContent=`GENESIS #${String(id).padStart(3,'0')}`;els('detailType').textContent=names[c.kind]+(c.frozen?' / PRESERVED':'');els('detailProofs').textContent=c.proofs;els('detailHash').textContent=demoHash(c).slice(0,20)+'…';els('modalArt').innerHTML=artwork(id,c.kind,c.proofs);els('detailHistory').innerHTML=c.history.length?c.history.map((h,i)=>`<div>SIMULATED WORK #${i+1}: ${h}</div>`).join(''):'<div>Genesis art · no proof events yet</div>';els('detailEvolve').disabled=c.frozen;els('modal').classList.add('open');els('modal').setAttribute('aria-hidden','false');document.body.style.overflow='hidden'}
function closeDetail(){els('modal').classList.remove('open');els('modal').setAttribute('aria-hidden','true');document.body.style.overflow=''}
function simulate(id){const c=state[id-1];if(c.frozen){toast('This canvas was preserved in demo mode.');return;}c.proofs++;c.history.push(['Reproducible contract tests','Audited deployment manifest','Verified collaboration contribution','Evidence manifest accepted'][c.proofs%4]);renderGallery();if(selected===id)openDetail(id)}
els('evolve').onclick=()=>{heroProof++;drawHero();toast('Simulated evolution — no real IMD proof was submitted.')};els('heroEvolve').onclick=()=>{els('heroCanvas').scrollIntoView({behavior:'smooth',block:'center'});setTimeout(()=>els('evolve').click(),400)};
els('filter').onchange=e=>{filter=e.target.value;limit=12;renderGallery()};els('sort').onchange=e=>{sort=e.target.value;renderGallery()};els('more').onclick=()=>{limit+=12;renderGallery()};els('close').onclick=els('closeOverlay').onclick=closeDetail;document.addEventListener('keydown',e=>{if(e.key==='Escape')closeDetail()});
els('detailEvolve').onclick=()=>simulate(selected);els('detailFreeze').onclick=()=>{if(!selected)return;const c=state[selected-1];toast(`Preserve preview for Genesis #${String(selected).padStart(3,'0')}. No transaction sent.`);};
els('monumentArt').innerHTML=artwork(256,2,16,true);els('monumentPreview').onclick=()=>{els('monumentArt').innerHTML=artwork(hash(Date.now()),2,24,true);toast('Concept visualization only. Monument contracts are not deployed.')};
els('wallet').onclick=async()=>{if(!window.ethereum){toast('No injected EVM wallet found. Install an EVM wallet to connect.');return;}try{const accounts=await window.ethereum.request({method:'eth_requestAccounts'});const address=accounts[0];els('wallet').textContent=address.slice(0,6)+'…'+address.slice(-4);toast('Wallet connected. Minting requires a deployed contract address.')}catch(e){toast('Wallet connection rejected or unavailable.')}};
drawHero();renderGallery();
