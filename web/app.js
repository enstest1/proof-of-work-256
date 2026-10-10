/* P//W deterministic collector preview. All work events here are SIMULATED.
   The contract is the canonical source in an actual connected deployment. */
const names=['ORBIT','VESSEL','LATTICE','FRACTURE'];
const els=id=>document.getElementById(id);
function hash(n){let a=(n^0x9e3779b9)>>>0;a=Math.imul(a^(a>>>16),0x85ebca6b);a=Math.imul(a^(a>>>13),0xc2b2ae35);return (a^(a>>>16))>>>0}
function rnd(n,s){return hash((n+1)*2654435761+s)/4294967295}
const state=Array.from({length:256},(_,i)=>({id:i+1,kind:i%4,proofs:0,history:[],frozen:false,dissent:0}));
let limit=12,filter='all',sort='id',selected=null,heroProof=0;
function artwork(seed,kind,proofs=0,monument=false,dissent=0){
 // Client-side ART PREVIEW, not the deployed Solidity svgOf() or verified work.
 // Four wholly different visual grammars; seeded deterministically, never random on refresh.
 const palette=['#dec593','#a9cadd','#e2dfd4','#c6a0a9'];
 const ink=palette[kind%4], nodes=16+Math.min(proofs,18)*2;
 const fx=v=>Number(v).toFixed(2);
 let s=`<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${names[kind%4]} generative art PREVIEW"><rect width="400" height="400" fill="#090b10"/><circle cx="200" cy="200" r="170" stroke="#252c34" stroke-width=".55" fill="none"/>`;
 if(kind===0){
  // ORBIT: calibrated epicycles, Kepler-like elliptical chords, elliptical nodes
  for(let j=0;j<7;j++)s+=`<ellipse cx="200" cy="200" rx="${54+j*17}" ry="${46+j*12}" transform="rotate(${j*19} 200 200)" fill="none" stroke="${ink}" stroke-width="${j%2?.65:1.2}" opacity="${.28+j*.065}"/>`;
  for(let i=0;i<nodes;i++){let a=(i*2.39996+rnd(seed,i)*.17),r=48+(i%7)*16,x=200+Math.cos(a)*r,y=200+Math.sin(a)*r;
   s+=`<circle cx="${fx(x)}" cy="${fx(y)}" r="${i%5===0?3.3:1.4}" fill="${i%4===0?'#f2ede2':ink}"/><path d="M200 200 Q${fx(200+Math.cos(a+.8)*r*.7)} ${fx(200+Math.sin(a+.8)*r*.7)} ${fx(x)} ${fx(y)}" fill="none" stroke="${ink}" stroke-width=".7" opacity=".65"/>`;
  }
 }else if(kind===1){
  // VESSEL: symmetrical vase silhouettes, woven vertical strands and nested curves
  for(let j=0;j<11;j++){let w=110+j*5,edge=200+w*.6;
   s+=`<path d="M${fx(200-w*.35)} 61 C${fx(200-w)} 144 ${fx(200-w*.9)} 270 ${fx(200-w*.3)} 338 Q200 ${fx(350-j*2)} ${fx(200+w*.3)} 338 C${fx(200+w*.9)} 270 ${fx(200+w)} 144 ${fx(200+w*.35)} 61" stroke="${ink}" fill="none" opacity="${fx(.19+j*.064)}" stroke-width="${j%3===0?1.4:.75}"/>`;
  }
  for(let i=0;i<nodes;i++){let y=65+(i*13)%275,offset=16+(rnd(seed,i)-.5)*100;
   s+=`<path d="M${fx(200-offset)} ${fx(y)} Q200 ${fx(y+26)} ${fx(200+offset)} ${fx(y)}" stroke="${ink}" fill="none" stroke-width=".6" opacity=".55"/>`;
  }
 }else if(kind===2){
  // LATTICE: precise rectangular intersections, rotated crystalline cells
  s+=`<path d="M50 50 L350 50 350 350 50 350Z" stroke="${ink}" stroke-width="1" fill="none"/>`;
  for(let i=0;i<12;i++){let x=69+i*24; s+=`<path d="M${x} 50 L${x} 350 M50 ${x} L350 ${x}" stroke="${ink}" stroke-width=".7" opacity="${i%3===0?.55:.23}" fill="none"/>`}
  for(let i=0;i<nodes;i++){let x=67+Math.floor(rnd(seed,i)*12)*24,y=67+Math.floor(rnd(seed,i+111)*12)*24,size=4+4*rnd(seed,i+222);
   s+=`<rect x="${fx(x-size)}" y="${fx(y-size)}" width="${fx(size*2)}" height="${fx(size*2)}" transform="rotate(45 ${fx(x)} ${fx(y)})" fill="none" stroke="${ink}" stroke-width="${i%5===0?1.8:.8}" opacity=".82"/>`;
  }
 }else{
  // FRACTURE: asymmetrical broken diagonals, fault lines, displaced geometry
  for(let j=0;j<11;j++){let x=86+j*22,shift=(rnd(seed,j)-.5)*48;
   s+=`<path d="M${fx(x)} 42 L${fx(x-26)} 141 L${fx(x+shift+22)} 207 L${fx(x+shift-18)} 292 L${fx(x+31)} 357" stroke="${ink}" stroke-width="${j%4===0?1.8:.75}" fill="none" opacity="${fx(.25+j*.059)}"/>`;
  }
  for(let i=0;i<nodes;i++){let y=60+(i*29)%285,x=75+rnd(seed,i)*245;
   s+=`<path d="M${fx(x)} ${fx(y)} l${fx((rnd(seed,i+1)-.5)*70)} ${fx(-25+rnd(seed,i+2)*55)}" stroke="${i%6===0?'#f1d2c3':ink}" stroke-width="${i%4===0?1.7:.65}"/>`;
  }
 }
 if(dissent>0){let scars=Math.min(8,dissent);for(let i=0;i<scars;i++){let y=163+i*11;
  s+=`<path d="M${fx(149+i*6)} ${fx(y)} l${fx(48-i*2)} ${fx(15+i*2)}" stroke="#e78a79" opacity=".88" stroke-width="1.8"/>`;
 }}
 if(monument){for(let k=0;k<4;k++)s+=`<circle cx="200" cy="200" r="${36+k*32}" stroke="#d5bd8e" stroke-width=".8" fill="none" opacity=".66"/>`}
 return s+'<circle cx="200" cy="200" r="3.7" fill="#f2ebd8"/></svg>';
}
function toast(msg){els('toast').textContent=msg;els('toast').classList.add('show');clearTimeout(window._toast);window._toast=setTimeout(()=>els('toast').classList.remove('show'),3600)}
function drawHero(){els('heroCanvas').innerHTML=artwork(1,0,heroProof);els('heroProof').textContent=String(heroProof).padStart(3,'0');els('heroState').textContent=heroProof?'EVOLVING':'GENESIS'}
function card(c){return `<button class="art-card" data-id="${c.id}" aria-label="Open canvas ${c.id}"><div class="card-art">${artwork(c.id,c.kind,c.proofs,false,c.dissent)}</div><div class="card-footer"><div><div class="card-title">GENESIS #${String(c.id).padStart(3,'0')}</div><div class="card-sub">${names[c.kind]} · ${c.proofs} PROOFS</div></div><span class="card-index">↗</span></div></button>`}
function visible(){let all=state.filter(c=>filter==='all'||c.kind===+filter);if(sort==='proofs')all.sort((a,b)=>b.proofs-a.proofs||a.id-b.id);return all}
function renderGallery(){const all=visible();els('resultCount').textContent=`${all.length} WORKS`;els('gallery').innerHTML=all.slice(0,limit).map(card).join('');els('more').style.display=limit<all.length?'inline-block':'none';document.querySelectorAll('[data-id]').forEach(b=>b.onclick=()=>openDetail(+b.dataset.id))}
function demoHash(c){let x=hash(c.id*11939+c.proofs*3271);return '0x'+Array.from({length:8},(_,i)=>hash(x+i).toString(16).padStart(8,'0')).join('')}
function openDetail(id){selected=id;const c=state[id-1];els('detailTitle').textContent=`GENESIS #${String(id).padStart(3,'0')}`;els('detailType').textContent=names[c.kind]+(c.frozen?' / PRESERVED':'');els('detailProofs').textContent=c.proofs;els('detailHash').textContent=demoHash(c).slice(0,20)+'…';els('modalArt').innerHTML=artwork(id,c.kind,c.proofs,false,c.dissent);els('detailHistory').innerHTML=c.history.length?c.history.map((h,i)=>`<div>SIMULATED WORK #${i+1}: ${h}</div>`).join(''):'<div>Genesis art · no proof events yet</div>';els('detailEvolve').disabled=c.frozen;els('modal').classList.add('open');els('modal').setAttribute('aria-hidden','false');document.body.style.overflow='hidden'}
function closeDetail(){els('modal').classList.remove('open');els('modal').setAttribute('aria-hidden','true');document.body.style.overflow=''}
function simulate(id){const c=state[id-1];if(c.frozen){toast('This canvas was preserved in demo mode.');return;}c.proofs++;c.dissent=c.proofs%4===0?2:0;c.history.push(['Reproducible contract tests','Audited deployment manifest','Verified collaboration contribution','Evidence manifest accepted'][c.proofs%4]);renderGallery();if(selected===id)openDetail(id)}
els('evolve').onclick=()=>{heroProof++;drawHero();toast('Simulated evolution — no real IMD proof was submitted.')};els('heroEvolve').onclick=()=>{els('heroCanvas').scrollIntoView({behavior:'smooth',block:'center'});setTimeout(()=>els('evolve').click(),400)};
els('filter').onchange=e=>{filter=e.target.value;limit=12;renderGallery()};els('sort').onchange=e=>{sort=e.target.value;renderGallery()};els('more').onclick=()=>{limit+=12;renderGallery()};els('close').onclick=els('closeOverlay').onclick=closeDetail;document.addEventListener('keydown',e=>{if(e.key==='Escape')closeDetail()});
els('detailEvolve').onclick=()=>simulate(selected);els('detailFreeze').onclick=()=>{if(!selected)return;const c=state[selected-1];toast(`Preserve preview for Genesis #${String(selected).padStart(3,'0')}. No transaction sent.`);};
els('monumentArt').innerHTML=artwork(256,2,16,true);els('monumentPreview').onclick=()=>{els('monumentArt').innerHTML=artwork(hash(Date.now()),2,24,true);toast('Concept visualization only. Monument contracts are not deployed.')};
els('wallet').onclick=async()=>{if(!window.ethereum){toast('No injected EVM wallet found. Install an EVM wallet to connect.');return;}try{const accounts=await window.ethereum.request({method:'eth_requestAccounts'});const address=accounts[0];els('wallet').textContent=address.slice(0,6)+'…'+address.slice(-4);toast('Wallet connected. Minting requires a deployed contract address.')}catch(e){toast('Wallet connection rejected or unavailable.')}};
drawHero();renderGallery();
