/* PROOF//TRIAL experience v1. No simulated proof can be submitted as a real IMD result.
   Real proof state is exclusively the configured onchain contracts. */
(() => {
  'use strict';
  const byId = id => document.getElementById(id);
  const roles = [
    { title:'ARCHITECT',subtitle:'Structure',tone:'#d2b98b',note:'Proposes a deterministic geometry and commits its design.' },
    { title:'BUILDER',subtitle:'Execution',tone:'#9cbed7',note:'Constructs a candidate artifact against the objective.' },
    { title:'CRITIC',subtitle:'Review',tone:'#ded9cd',note:'Examines the artifact and records evidence of gaps.' },
    { title:'ADVERSARY',subtitle:'Challenge',tone:'#d98986',note:'Stress-tests the result and reports a challenge.' },
  ];
  const sim = Object.freeze({status:'SIMULATION ONLY',oracle:'NOT REQUESTED',transaction:'NONE',independentSeats:'NOT ESTABLISHED'});
  const seed = n => {let x = Math.imul((n | 0) ^ 0x6a09e667, 0x9e3779b9); x ^= x >>> 16; x = Math.imul(x, 0x85ebca6b); return (x ^ (x >>> 13)) >>> 0;};
  const gen = (n,k) => seed(n+31*k)/4294967295;
  const $ = (sel,root=document) => root.querySelector(sel);
  const safeId = n => Number.isSafeInteger(+n) ? Math.max(1,Math.min(256,+n)) : 42;
  const pad = n => String(n).padStart(3,'0');
  const escaped = str => String(str).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
  let canvasId=42, phase=0, chosen='A', playing=false, playbackToken=0, archiveIndex=0;
  let region = null;
  const model = (id, branch, stage=4) => {
    const k = (id-1)%4, names=['ORBIT','VESSEL','LATTICE','FRACTURE'];
    return {id,branch,stage,kind:k,name:names[k],roles,seed:seed(id*97 + (branch==='B'?731:11)),
      scoreRoot:null, oracleSignature:null, status:sim.status, stageLabel:['COMMISSION','PROPOSAL','CHALLENGE','REVIEW','PRESERVED PREVIEW'][stage]};
  };
  function art(id,branch='A',stage=4,interactive=false) {
    const m=model(id,branch,stage);
    const colors=['#e3c697','#96c2d3','#d9d7cc','#cba8b1'],ink=colors[m.kind];
    const t = x => (+x).toFixed(2);
    const mark=(role,d,opacity=.75,weight=.8) => `<path class="pw-trace" data-role="${role}" d="${d}" fill="none" stroke="${roles[role].tone}" opacity="${opacity}" stroke-width="${weight}" vector-effect="non-scaling-stroke"/>`;
    let s=`<svg class="pw-art ${interactive?'pw-selectable':''}" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${m.name} generative art, ${escaped(branch)} proposed future, demonstration not onchain"><defs><radialGradient id="pw-glow-${id}-${branch}-${stage}"><stop offset="0%" stop-color="${ink}" stop-opacity=".15"/><stop offset="100%" stop-color="${ink}" stop-opacity="0"/></radialGradient></defs><rect width="600" height="600" fill="#090b10"/><circle cx="300" cy="300" r="252" fill="url(#pw-glow-${id}-${branch}-${stage})"/><circle cx="300" cy="300" r="262" fill="none" stroke="#424956" stroke-width=".65" opacity=".65"/>`;
    const rows = 12 + stage*6;
    // Architect: distinctive immutable grammar per Genesis archetype.
    if(m.kind===0) for(let i=0;i<11;i++) {
      const rx=72+i*15,ry=64+i*12,ang=(i*23+m.seed%27);
      s+=`<ellipse data-role="0" class="pw-trace" cx="300" cy="300" rx="${rx}" ry="${ry}" transform="rotate(${ang} 300 300)" stroke="${ink}" stroke-width="${i%3===0?1.35:.68}" opacity="${.27+i*.049}" fill="none"/>`;
    } else if(m.kind===1) for(let i=0;i<15;i++) {
      const q=i*4;
      s+=mark(0,`M ${205-q/3} 72 C ${80-q} 160 ${128-q} 426 ${242-q/8} 518 Q300 ${542-i} ${358+q/8} 518 C ${472+q} 426 ${520+q} 160 ${395+q/3} 72`,.18+i*.045,.6+(i%5===0?.8:0));
    } else if(m.kind===2) {
      s+=mark(0,'M110 110 L490 110 L490 490 L110 490 Z',.84,1.5);
      for(let i=0;i<16;i++){const pos=124+i*23;s+=mark(0,`M ${pos} 110 V490 M110 ${pos} H490`,i%4===0?.56:.23,.6);}
    } else for(let i=0;i<19;i++) {
      const x=100+i*20,displace=gen(id,i+3)*64-32;
      s+=mark(0,`M ${t(x)} 60 L ${t(x-45)} 210 L ${t(x+displace+20)} 309 L ${t(x+displace-25)} 420 L ${t(x+25)} 542`,.15+i*.038,i%4===0?1.6:.7);
    }
    // Builder: reproducible geometry formed from seed + task stage.
    if(stage>=1) for(let i=0;i<rows;i++) {
      const a=i*2.399963+gen(m.seed,i)*.38, r=49+gen(m.seed,i+19)*195;
      const x=300+Math.cos(a)*r, y=300+Math.sin(a)*r;
      if(m.kind===2) {
        const gx=120+Math.floor(gen(m.seed,i)*16)*23,gy=120+Math.floor(gen(m.seed,i+76)*16)*23;
        s+=`<rect data-role="1" class="pw-trace" x="${gx-7}" y="${gy-7}" width="14" height="14" transform="rotate(45 ${gx} ${gy})" stroke="${ink}" fill="none" opacity=".8"/>`;
      } else s+=mark(1,`M300 300 Q${t(300+Math.cos(a+.75)*r*.7)} ${t(300+Math.sin(a+.75)*r*.7)} ${t(x)} ${t(y)}`,.25+gen(m.seed,i+14)*.63,i%7===0?1.6:.66);
      s+=`<circle class="pw-trace" data-role="1" cx="${t(x)}" cy="${t(y)}" r="${i%7===0?2.8:1.1}" fill="${ink}" opacity=".85"/>`;
    }
    // Critic: negative-space findings / counterform.
    if(stage>=2) for(let i=0;i<8;i++){const a=i*Math.PI/4+gen(m.seed,229)*.5,ra=160+i%3*16,x=300+Math.cos(a)*ra,y=300+Math.sin(a)*ra;
      s+=mark(2,`M${t(x-12)} ${t(y-12)} l24 24 M${t(x+12)} ${t(y-12)} l-24 24`,.35,.75);
    }
    // Adversary: one permanent-looking scar per challenged proposal; purely illustrative here.
    if(stage>=3){const offset=branch==='B'?27:-13;for(let i=0;i<7;i++)s+=mark(3,`M${183+i*4+offset} ${274+i*13} l${65-i*3} ${19+i*3}`,.68,1.45);}
    s+=`<circle cx="300" cy="300" r="3" fill="#f3e9d6"/><text x="30" y="565" font-size="8" fill="#798290" font-family="monospace" letter-spacing="3">PROPOSED FUTURE ${branch} / GENESIS ${pad(id)}</text><text x="570" y="565" font-size="8" fill="#798290" font-family="monospace" text-anchor="end">PREVIEW ONLY</text></svg>`;
    return s;
  }
  function renderStage(){
    if(!region) return;
    byId('trialCanvas').innerHTML=art(canvasId,chosen,phase,true);
    byId('trialStatus').textContent=`GENESIS #${pad(canvasId)} · FUTURE ${chosen} · ${model(canvasId,chosen,phase).stageLabel}`;
    byId('trialPhase').textContent=`${phase+1} / 5`;
    document.querySelectorAll('[data-trial-phase]').forEach((node,i)=>{node.classList.toggle('active',i===phase);node.setAttribute('aria-current',i===phase?'step':'false');});
    byId('trialNotes').textContent=phase===0?'A collector proposes an objective. No IMD job has been opened.':phase===1?'Architect and Builder propose competing candidate designs. No independently accepted agent records exist in this demo.':phase===2?'The Critic identifies uncertainties; these marks are illustrative, not verified findings.':phase===3?'An Adversary challenges both candidates. No real signed IMD verdict is implied.':'A collector previews one potential future. The onchain canvas remains unchanged.';
    document.querySelectorAll('[data-trial-branch]').forEach(btn=>btn.setAttribute('aria-pressed',btn.dataset.trialBranch===chosen?'true':'false'));
    byId('trialTruth').textContent='SIMULATION · no IMD job · no signature · no chain transaction';
    renderInspector('architect');
  }
  function renderInspector(role){
    const r = roles.find(x=>x.title.toLowerCase()===String(role).toLowerCase())||roles[0];
    const target=byId('xrayDetail');if(!target)return;
    target.replaceChildren();
    const h=document.createElement('h3');h.textContent=`${r.title} / ${r.subtitle}`;target.append(h);
    const p=document.createElement('p');p.textContent=r.note;target.append(p);
    const table=document.createElement('dl');table.className='proof-facts';
    for(const [k,v] of [['Genesis',`#${pad(canvasId)}`],['Variant',`Future ${chosen}`],['Evidence status','UNVERIFIED PREVIEW'],['IMD job',sim.oracle],['Agent work record','NOT AVAILABLE'],['Oracle attestation',sim.oracle],['Onchain transaction',sim.transaction]]){
      const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=k;dd.textContent=v;table.append(dt,dd);
    }
    target.append(table);
  }
  function renderArchive(){
    byId('archiveArt').innerHTML=art(canvasId,chosen,archiveIndex,false);
    byId('archiveState').textContent=`PREVIEW CHECKPOINT ${archiveIndex+1} / 5 · ${model(canvasId,chosen,archiveIndex).stageLabel}`;
    byId('archiveDescription').textContent='Deterministic reconstruction of a simulated concept. No irreversible recorded evolution or snapshot exists onchain.';
  }
  const wait = ms => new Promise(resolve => setTimeout(resolve,ms));
  async function playback() {
    const token=++playbackToken; playing=true;
    const btn=byId('trialPlay');btn.disabled=true;btn.textContent='CREATION IN PROGRESS';
    for(let i=0;i<5;i++){
      if(token!==playbackToken)break;
      phase=i;renderStage();renderArchive();
      const svg=$('#trialCanvas svg');if(svg)svg.classList.add('pw-animate');
      await wait(1600);
    }
    if(token===playbackToken){playing=false;btn.disabled=false;btn.textContent='REPLAY THE BIRTH ↻';}
  }
  function initTrial(){
    region=byId('trial');if(!region)return;
    const requested=new URLSearchParams(window.location.search).get('canvas');
    if(requested!==null&&/^\d{1,3}$/.test(requested))canvasId=safeId(+requested);
    byId('trialCanvasId').value=String(canvasId);
    byId('trialCanvasId').addEventListener('change',e=>{canvasId=safeId(e.target.value);e.target.value=canvasId;phase=0;archiveIndex=0;renderStage();renderArchive();renderCommons();});
    for(const btn of document.querySelectorAll('[data-trial-branch]'))btn.addEventListener('click',()=>{chosen=btn.dataset.trialBranch;phase=0;renderStage();renderArchive();});
    for(const btn of document.querySelectorAll('[data-trial-phase]'))btn.addEventListener('click',()=>{playbackToken++;playing=false;byId('trialPlay').disabled=false;byId('trialPlay').textContent='REPLAY THE BIRTH ↻';phase=+btn.dataset.trialPhase;renderStage();renderArchive();});
    byId('trialPlay').addEventListener('click',()=>{if(!playing)playback();});
    byId('trialNext').addEventListener('click',()=>{playbackToken++;playing=false;byId('trialPlay').disabled=false;byId('trialPlay').textContent='REPLAY THE BIRTH ↻';phase=(phase+1)%5;renderStage();renderArchive();});

    byId('trialExport').addEventListener('click',()=>{
      const body=art(canvasId,chosen,phase,false);
      const blob=new Blob([body],{type:'image/svg+xml;charset=utf-8'});
      const url=URL.createObjectURL(blob);
      const anchor=document.createElement('a');anchor.href=url;anchor.download=`PROOF-TRIAL-GENESIS-${pad(canvasId)}-FUTURE-${chosen}-UNVERIFIED.svg`;
      document.body.append(anchor);anchor.click();anchor.remove();URL.revokeObjectURL(url);
      byId('trialTruth').textContent='SVG EXPORTED · SIMULATED ART · NOT AUTHENTICATED ONCHAIN';
    });
    byId('trialShare').addEventListener('click',async()=>{
      const url=new URL(window.location.href);url.searchParams.set('canvas',String(canvasId));url.hash='trial';
      try { await navigator.clipboard.writeText(url.toString());byId('trialTruth').textContent='LINK COPIED · PREVIEW ONLY'; }
      catch { byId('trialTruth').textContent='LINK: '+url.toString(); }
    });

    byId('archiveSlider').addEventListener('input',e=>{archiveIndex=Math.max(0,Math.min(4,+e.target.value));renderArchive();});
    byId('trialCanvas').addEventListener('click',e=>{const el=e.target.closest('[data-role]');if(!el)return;const r=roles[+el.dataset.role];renderInspector(r.title);});
    byId('trialCanvas').addEventListener('keydown',e=>{if(e.key==='Enter')renderInspector('ARCHITECT');});
    byId('trialSelectFromGallery').addEventListener('click',()=>{canvasId=safeId(window.ProofWorkPreview?.selected||42);byId('trialCanvasId').value=canvasId;renderStage();renderArchive();region.scrollIntoView({behavior:'smooth'});});
    window.addEventListener('proofwork:open-trial',e=>{canvasId=safeId(e.detail?.id||42);byId('trialCanvasId').value=canvasId;phase=0;archiveIndex=0;renderStage();renderArchive();region.scrollIntoView({behavior:'smooth'});});
    renderStage();renderArchive();renderCommons();
    byId('commonsCanvas').addEventListener('click',e=>{const node=e.target.closest('[data-canvas-id]');if(!node)return;canvasId=safeId(node.dataset.canvasId);byId('trialCanvasId').value=canvasId;phase=0;archiveIndex=0;renderStage();renderArchive();renderCommons();byId('commonsStatus').textContent=`Genesis #${pad(canvasId)} selected. All Commons links are conceptual until onchain collaborations exist.`;});
    byId('commonsView').addEventListener('change',renderCommons);
  }
  function renderCommons(){
    if(root.ProofCivilization?.isActive){root.ProofCivilization.selectCanvas(canvasId);return;}
    const host=byId('commonsCanvas');if(!host)return;
    const compact=byId('commonsView').value==='constellation';
    let links='',nodes='';
    for(let i=1;i<=256;i++){
      const ix=i-1, ring=Math.floor(ix/64),angle=2*Math.PI*((ix%64)/64)+ring*.17;
      const radius=105+ring*58+(gen(i,7)-.5)*17;
      const x=400+Math.cos(angle)*radius,y=400+Math.sin(angle)*radius;
      if(compact&&i%5===0){const j=((i+68)%256)+1,aj=2*Math.PI*((j-1)%64)/64+Math.floor((j-1)/64)*.17,rj=105+Math.floor((j-1)/64)*58+(gen(j,7)-.5)*17;
        links+=`<line x1="${x.toFixed(1)}" y1="${y.toFixed(1)}" x2="${(400+Math.cos(aj)*rj).toFixed(1)}" y2="${(400+Math.sin(aj)*rj).toFixed(1)}" stroke="#7e8ea6" stroke-dasharray="2 7" opacity=".18"/>`;
      }
      const color=['#d9be90','#9eb9d4','#d8d7d0','#d9a8b4'][ix%4];
      nodes+=`<g class="commons-node" data-canvas-id="${i}" role="button" tabindex="0" aria-label="Select Genesis ${i}"><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${i===canvasId?5.7:2.5}" fill="${color}" opacity="${i===canvasId?1:.73}"/>${i===canvasId?`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="11" fill="none" stroke="#f0e0bb"/>`:''}</g>`;
    }
    host.innerHTML=`<svg viewBox="0 0 800 800" role="img" aria-label="256 preview nodes. Any dotted links are simulated illustration, zero independently verified collaborations."><rect width="800" height="800" fill="#0a0d12"/><circle cx="400" cy="400" r="317" stroke="#303641" stroke-width="1" fill="none"/>${links}${nodes}<text x="400" y="406" text-anchor="middle" fill="#e7d4a9" font-size="16" letter-spacing="7">THE 256</text><text x="400" y="430" text-anchor="middle" fill="#949daa" font-size="9" letter-spacing="3">0 CONFIRMED COLLABORATION EDGES</text></svg>`;
    host.querySelectorAll('[data-canvas-id]').forEach(n=>n.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();n.dispatchEvent(new MouseEvent('click',{bubbles:true}));}}));
    byId('commonsLegend').textContent=compact?'Dotted connections are a DEMO of potential graph relationships, not confirmed IMD collaborations.':'256 Genesis positions. No verified collaboration edges have been published.';
  }
  function globalTrial(){window.ProofWorkTrial=Object.freeze({art,model,getStatus:()=>sim});}
  document.addEventListener('DOMContentLoaded',()=>{globalTrial();initTrial();});
})();
