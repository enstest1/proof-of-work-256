/* PROOF//OF//WORK — MATH ATELIER 1.0
   Deterministic mathematical compositions. All input proof values are DEMONSTRATION inputs,
   not oracle-certified attributes. No keys, signing, minting or external model calls. */
(function (scope) {
'use strict';
const NS='http://www.w3.org/2000/svg';
const kinds=['ORBIT','VESSEL','LATTICE','FRACTURE','CIVILIZATION'];
const colors=[['#eddaab','#a99d7b','#98aebd'],['#9ad0e0','#b5b1cd','#efcf98'],['#e4e0c7','#80b6bc','#bdac91'],['#d48d90','#e7bd83','#92b2c2'],['#dfc393','#9ab6b8','#d48c92']];
const mix=(a,b,t)=>a+(b-a)*t;
const fmt=n=>Number(n).toFixed(2);
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
function number(v,lo,hi,fallback){const n=Number(v);return Number.isFinite(n)?clamp(Math.floor(n),lo,hi):fallback;}
function hash(x){x=(x|0)^0x9e3779b9;x=Math.imul(x^(x>>>16),0x85ebca6b);x=Math.imul(x^(x>>>13),0xc2b2ae35);return(x^(x>>>16))>>>0;}
const h01=(seed,i)=>hash(seed^Math.imul(i+1,0x632be59b))/4294967295;
function params(raw={}){
 const id=number(raw.id,1,256,42),style=kinds.includes(String(raw.style).toUpperCase())?String(raw.style).toUpperCase():kinds[(id-1)%4];
 return {id,style,branch:raw.branch==='B'?'B':'A',proofs:number(raw.proofs,0,24,0),dissent:number(raw.dissent,0,12,0),era:number(raw.era,0,4,0),detail:number(raw.detail,1,3,2),guide:Boolean(raw.guide)};
}
function seedOf(p){return hash(p.id*0x1e35a7bd+ kinds.indexOf(p.style)*6331+(p.branch==='B'?8971:11)+p.proofs*157+p.dissent*701+p.era*2843);}
function atelier(raw={}){
 const p=params(raw),seed=seedOf(p),guide=p.guide,c=colors[kinds.indexOf(p.style)];
 const strokes=[];
 const gold=guide?'#111111':c[0],pale=guide?'#242424':c[1],blue=guide?'#111111':c[2],red=guide?'#101010':'#d18786';
 const ink=(s)=>guide?'#111111':s;
 const path=(d,col=gold,width=.7,opacity=.65,extra='')=>strokes.push(`<path d="${d}" fill="none" stroke="${ink(col)}" stroke-width="${fmt(width*(guide?1:1.32))}" opacity="${fmt(clamp(opacity*(guide?1:1.48),0,1))}" ${extra}/>`);
 const dot=(x,y,r,col=gold,alpha=.8)=>strokes.push(`<circle cx="${fmt(x)}" cy="${fmt(y)}" r="${fmt(r)}" fill="${ink(col)}" opacity="${fmt(clamp(alpha*(guide?1:1.16),0,1))}"/>`);
 const poly=(pts,col=gold,width=.7,alpha=.6)=>path('M '+pts.map(v=>fmt(v[0])+' '+fmt(v[1])).join(' L '),col,width,alpha);
 const pointSet=(fn,steps)=>{let out='';for(let i=0;i<=steps;i++){const xy=fn(i/steps);out+=(i?' L ':'M ')+fmt(xy[0])+' '+fmt(xy[1]);}return out;};
 function orbit(){
   // Interfering hypocycloid / epicycloid rings, indexed by the immutable DNA.
   for(let j=0;j<116*p.detail/2;j++){
     const layer=j/116*2/p.detail,rr=mix(92,410,layer);const m=5+(seed%7),k=1.8+(seed%130)/95;
     const frequency=(p.branch==='B'?-1:1),tilt=.37+j*.0035;
     const d=pointSet(t=>{const a=t*Math.PI*2;const r=rr+15*Math.sin(a*m+layer*3.5)+11*Math.sin(k*a*3+layer*4);
       return [600+Math.cos(a+tilt)*r*.90+Math.sin(a*8+layer*4)*10*frequency,575+Math.sin(a+tilt)*r*.77+Math.cos(a*5+layer*6)*6];},165);
     path(d,j%9===0?blue:j%5===0?pale:gold,j%11===0?1.25:.43,.20+.42*(1-layer*.55));
   }
   for(let i=0;i<64;i++){const a=i*Math.PI*2/64,rad=408+h01(seed,i)*26;
     const x=600+Math.cos(a)*rad*.94,y=575+Math.sin(a)*rad*.8;
     if(i%4===0){path(`M ${fmt(x)} ${fmt(y)} L ${fmt(x+Math.cos(a)*28)} ${fmt(y+Math.sin(a)*28)}`,blue,.7,.48);dot(x,y,2,blue,.8);} }
   for(let j=0;j<14;j++){const rad=62+j*25;
     path(pointSet(t=>[600+Math.cos(t*Math.PI*2)*(rad*1.03),575+Math.sin(t*Math.PI*2)*(rad*.81)],90),pale,.35,.22);}
   for(let i=0;i<p.proofs;i++){const a=i*2.39996+seed%50;dot(600+Math.cos(a)*355,575+Math.sin(a)*289,4,blue,.8);}
 }
 function vessel(){
   // Sculptural interference surface — traces of a warped surface of revolution.
   const strandCount=Math.floor(110*p.detail/2);
   for(let j=0;j<strandCount;j++){
     const depth=j/(strandCount-1),band=-1+2*depth;
     const d=pointSet(t=>{const y=150+t*810,profile=Math.pow(Math.max(.01,Math.sin(Math.PI*t)),.68);
       const waist=.48+.34*Math.sin(Math.PI*2*t + (seed%100)*.002+band*.5);
       const width=285*profile*waist+85*profile;
       const twist=42*Math.sin(t*Math.PI*2.45+band*4.6)*profile;
       const x=600+band*width+twist+Math.cos(10*t+band*3)*(1+depth*4);
       return [x,y];},126);
     path(d,j%14===0?blue:j%5===0?gold:pale,j%20===0?1.1:.53,.2+.46*Math.sin(Math.PI*depth));
   }
   for(let h=0;h<33;h++){
     const t=.035+h/35,y=150+t*810,profile=Math.pow(Math.max(.01,Math.sin(Math.PI*t)),.68),w=345*profile*(.48+.34*Math.sin(Math.PI*2*t+(seed%100)*.002));
     path(pointSet(u=>{const angle=u*Math.PI;return [600+Math.cos(angle)*w,y+Math.sin(angle)*20*Math.sin(Math.PI*t)];},55),h%4?blue:gold,.4,h%4?.17:.48);
   }
   for(let k=0;k<16;k++){const t=.1+k*.052,y=150+810*t;path(`M ${fmt(600-15)} ${fmt(y)} Q 600 ${fmt(y-16)} ${fmt(615)} ${fmt(y)}`,gold,.65,.42);}
   for(let i=0;i<p.proofs;i++)dot(600+Math.sin(i*1.7)*65,200+i*23,3.1,blue,.8);
 }
 function lattice(){
   // Woven, smoothly warped quasi-crystal fields with opposing wave directions.
   const count=Math.floor(104*p.detail/2);
   function xy(i,t,axis){const off=-410+i*820/(count-1),v=-430+860*t;
     let a=axis?off:v,b=axis?v:off;
     const r=Math.hypot(a,b),ang=Math.atan2(b,a),swirl=29*Math.sin(r*.014+(seed%71)*.04)*Math.exp(-r/530);
     const phase=(p.branch==='B'?-1:1)*swirl;
     const xx=a+Math.cos(ang+Math.PI/2)*phase + 9*Math.sin(b*.024+off*.011);
     const yy=b+Math.sin(ang+Math.PI/2)*phase + 11*Math.sin(a*.022+off*.014);
     const co=Math.cos(.18+(seed%15)*.005),si=Math.sin(.18+(seed%15)*.005);
     return [600+xx*co-yy*si,580+xx*si+yy*co];}
   for(let axis=0;axis<2;axis++)for(let i=0;i<count;i++){
     path(pointSet(t=>xy(i,t,axis),80),axis?blue:gold,i%10===0?1.0:.39,i%7===0?.54:.22);
   }
   // Crystal interference rings and intentional empty central negative space.
   for(let j=0;j<30;j++){const rad=52+j*7;path(pointSet(t=>{const a=t*Math.PI*2;return [600+Math.cos(a)*rad*1.13,580+Math.sin(a)*rad*.91];},95),pale,.38,.12+j*.005);}
   for(let j=0;j<85;j++){const a=h01(seed,j)*Math.PI*2,r=70+h01(seed,j+123)*345; if(j%5===0)dot(600+Math.cos(a)*r,580+Math.sin(a)*r,1.7,gold,.7);}
   for(let k=0;k<p.proofs;k++){const a=k*2.39996;dot(600+Math.sin(a)*270,580+Math.cos(a)*270,3.5,pale,1);}
 }
 function fracture(){
   // Angular Voronoi-like segmentation and self-similar repair filaments.
   const split=0.23+(seed%100)/340;
   for(let j=0;j<150*p.detail/2;j++){
     const a=h01(seed,j)*Math.PI*2,aa=a+(h01(seed,j+333)-.5)*.28;
     const r=68+h01(seed,j+671)*340,length=55+h01(seed,j+918)*220;
     const x=600+Math.cos(a)*r,y=570+Math.sin(a)*r*.87;
     const q=aa+(j%3-1)*.33;
     const x2=x+Math.cos(q)*length*.78,y2=y+Math.sin(q)*length*.7;
     poly([[600+Math.cos(a)*(r-12),570+Math.sin(a)*(r-12)*.86],[x,y],[x2,y2]],j%7===0?red:j%4===0?blue:gold,j%11===0?1.45:.53,.17+h01(seed,j+8)*.50);
     if(j%9===0){poly([[x,y],[x2,y2],[x2+Math.cos(q+1.4)*31,y2+Math.sin(q+1.4)*31]],red,.78,.57);}
   }
   // Precommitted scar silhouettes in red, repaired with duplicate gold paths.
   const steps=20,scars=4+p.dissent;
   for(let j=0;j<scars;j++){
     const o=(j-(scars-1)/2)*28;
     const line=pointSet(t=>{const y=142+t*829,x=565+o+48*Math.sin(t*11+split*8)+27*Math.sin(t*23.5+o);return [x,y];},steps);
     path(line,red,1.6,.58);
     if(j%2===0 && p.proofs>0)path(line,gold,.58,.83,'stroke-dasharray="4 12"');
   }
   for(let j=0;j<90;j++){const a=j*2.399963,rad=75+3.3*j;dot(600+Math.cos(a)*rad,580+Math.sin(a)*rad*.85,h01(seed,j+200)*1.8+.4,blue,.30);}
 }
 function civilization(){
   // Four distinct districts, each triangulated around an archipelago of 64 nodes.
   const hubs=[[365,340],[825,365],[390,820],[810,795]];
   const coordinates=[];
   for(let i=0;i<256;i++){
     const c=i%4,ix=Math.floor(i/4),row=Math.floor(ix/8),col=ix%8;
     const a=(col/8)*Math.PI*2+(c+.5)*.30,rad=28+row*25+(h01(seed,i)-.5)*12;
     const cx=hubs[c][0]+Math.cos(a)*rad*1.06+Math.sin(row*1.7+col)*14;
     const cy=hubs[c][1]+Math.sin(a)*rad*.72;
     coordinates.push([cx,cy,c]);
   }
   // District radial contours become plottable architectural islands.
   for(let district=0;district<4;district++){
     const [cx,cy]=hubs[district];
     for(let ring=0;ring<24;ring++){
       const rad=40+ring*7.4;
       const d=pointSet(t=>{const a=t*Math.PI*2;const variation=1+.06*Math.sin(a*8+ring*.19)+.08*Math.sin(a*13+district);return [cx+Math.cos(a)*rad*variation,cy+Math.sin(a)*rad*.80*variation];},130);
       path(d,[gold,blue,pale,red][district],ring%6===0?1.0:.4,ring%6===0?.5:.17);
     }
   }
   // Persistent nodes become crystal-like small architecture, not stars.
   for(let i=0;i<256;i++){
     const [x,y,c]=coordinates[i],h=4+(hash(i^seed)%27)*(1+p.era*.12);
     if(i%2===0){const q=h*.55;poly([[x-q,y],[x,y-h],[x+q,y],[x,y+h*.24],[x-q,y]],colors[c][0],.42,.35);}
     dot(x,y,i%9===0?2.8:1.1,[gold,blue,pale,red][c],.78);
   }
   // Concept bridges are explicitly NOT accepted collaborations.
   const links=[ [0,1],[1,3],[3,2],[2,0],[0,3],[1,2] ];
   for(let i=0;i<p.era*7;i++){const l=links[i%6],a=coordinates[(i*13)%64*4+l[0]],b=coordinates[((i*17+11)%64)*4+l[1]];
     path(`M ${fmt(a[0])} ${fmt(a[1])} Q600 ${fmt(495+Math.sin(i*3)*110)} ${fmt(b[0])} ${fmt(b[1])}`,i%3===0?gold:blue,.75,.31,'stroke-dasharray="3 8" data-proof="UNVERIFIED"');}
   const ring=pointSet(t=>[600+Math.cos(t*Math.PI*2)*445,570+Math.sin(t*Math.PI*2)*445],140);
   path(ring,pale,.72,.25);
 }
 const bg=guide?'#ffffff':'#080b10';
 const grad=guide?'':`<defs><radialGradient id="halo" cx="50%" cy="49%" r="58%"><stop offset="0%" stop-color="#17202a"/><stop offset="64%" stop-color="#0d131c"/><stop offset="100%" stop-color="#07090d"/></radialGradient><linearGradient id="frame"><stop offset="0" stop-color="${c[0]}" stop-opacity=".03"/><stop offset=".5" stop-color="${c[0]}" stop-opacity=".52"/><stop offset="1" stop-color="${c[0]}" stop-opacity=".03"/></linearGradient></defs>`;
 if(p.style==='ORBIT')orbit();else if(p.style==='VESSEL')vessel();else if(p.style==='LATTICE')lattice();else if(p.style==='FRACTURE')fracture();else civilization();
 const extras=guide?'':`<rect x="35" y="35" width="1130" height="1130" fill="none" stroke="url(#frame)" stroke-width="1"/><path d="M74 78 h90 M74 78 v90 M1126 78 h-90 M1126 78 v90 M74 1122 h90 M74 1122 v-90 M1126 1122 h-90 M1126 1122 v-90" stroke="${c[0]}" stroke-opacity=".25" stroke-width="1" fill="none"/><text x="88" y="109" font-size="11" letter-spacing="4" font-family="monospace" fill="${c[0]}">PROOF//OF//WORK</text><text x="1115" y="109" text-anchor="end" font-size="10" letter-spacing="3" font-family="monospace" fill="#87929d">MATH ATELIER / ${p.style}</text><text x="88" y="1095" font-size="12" letter-spacing="4" font-family="monospace" fill="${c[0]}">GENESIS ${String(p.id).padStart(3,'0')} · ${p.branch}</text><text x="1115" y="1095" text-anchor="end" font-size="10" letter-spacing="2" font-family="monospace" fill="#a0acb6">SPECULATIVE / NOT VERIFIED</text>`;
 let marks='';if(!guide){for(let i=0;i<175;i++){const x=90+h01(seed,i)*1020,y=115+h01(seed,i+666)*945;marks+=`<circle cx="${fmt(x)}" cy="${fmt(y)}" r="${fmt(.25+h01(seed,i+1666)*.55)}" fill="#b3bfcc" opacity=".18"/>`;}}
 const rootSvg=`<svg xmlns="${NS}" width="1200" height="1200" viewBox="0 0 1200 1200"><rect width="1200" height="1200" fill="${bg}"/>${grad}${guide?'':'<rect width="1200" height="1200" fill="url(#halo)"/>'}${marks}${strokes.join('')}${extras}</svg>`;
 return rootSvg;
}
function social(raw={}){
 const p=params(raw),base=atelier(p).replace(/^<svg\s+[^>]+>/,'').replace(/<\/svg>\s*$/,'');
 const tint=colors[kinds.indexOf(p.style)][0];
 return `<svg xmlns="${NS}" viewBox="0 0 1080 1350" width="1080" height="1350"><rect width="1080" height="1350" fill="#080b10"/><svg x="18" y="120" width="1044" height="1044" viewBox="0 0 1200 1200">${base}</svg><text x="56" y="75" fill="${tint}" font-family="monospace" font-size="23" letter-spacing="5">PROOF//OF//WORK</text><text x="1024" y="75" text-anchor="end" fill="#aab4c1" font-family="monospace" font-size="16" letter-spacing="3">THE 256</text><text x="56" y="1232" fill="#ecdfbe" font-family="sans-serif" font-size="48" letter-spacing="2">${p.style} / GENESIS #${String(p.id).padStart(3,'0')}</text><text x="56" y="1286" fill="#a1acb9" font-family="monospace" font-size="15" letter-spacing="2">DETERMINISTIC ARTWORK STUDY · ${p.branch==='B'?'ALTERNATE':'GENESIS'} · NOT MINTED</text><path d="M56 1314 H1024" stroke="${tint}" opacity=".4"/></svg>`;
}
const prompt=raw=>{const p=params(raw);return `PROOF//OF//WORK ${p.style}, Genesis #${p.id}, mathematical generative fine art, ultrafine elegant plotted filaments, deterministic geometry as the exact source composition, celestial instrument engraving, premium gallery print, precise linework, rich negative space, ${p.style==='CIVILIZATION'?'four interconnected architectural archipelagos and procedural city plan':p.style==='VESSEL'?'organic symmetrical interference contours':p.style==='FRACTURE'?'fractured crystalline strands repaired with golden seams':p.style==='LATTICE'?'woven quasiperiodic mathematical lattice':'hypocycloid harmonograph celestial orbits'}, warm precious-metal foil and mineral pigments on almost-black paper, preserve structure of ControlNet conditioning input, no lettering, no people, no logos, no blur, not a photograph. Source seed ${seedOf(p)}.`;};
function download(name,text,mime='image/svg+xml'){const a=document.createElement('a'),link=URL.createObjectURL(new Blob([text],{type:mime}));a.href=link;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(link),10000);}
async function png(svg,name,scale=1){const img=new Image(),url=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml'}));try{
 await new Promise((ok,fail)=>{img.onload=ok;img.onerror=()=>fail(Error('SVG raster failed'));img.src=url;});
 const w=svg.includes('viewBox="0 0 1080 1350"')?1080:1200,h=svg.includes('viewBox="0 0 1080 1350"')?1350:1200;
 const canvas=document.createElement('canvas');canvas.width=w*scale;canvas.height=h*scale;const ctx=canvas.getContext('2d');ctx.drawImage(img,0,0,canvas.width,canvas.height);
 await new Promise(ok=>canvas.toBlob(b=>{if(b){const a=document.createElement('a'),u=URL.createObjectURL(b);a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),10000);}ok();},'image/png'));}finally{URL.revokeObjectURL(url);}}
function init(doc){const box=doc.getElementById('atelier');if(!box)return;
 const controls=['id','style','branch','proofs','dissent','era'].reduce((acc,key)=>(acc[key]=doc.getElementById('atelier-'+key),acc),{});
 const read=()=>({id:controls.id.value,style:controls.style.value,branch:controls.branch.value,proofs:controls.proofs.value,dissent:controls.dissent.value,era:controls.era.value,detail:2});
 const target=doc.getElementById('atelier-output'),message=doc.getElementById('atelier-status');
 function draw(){const p=params(read());target.innerHTML=atelier(p);doc.getElementById('atelier-seed').textContent=String(seedOf(p));message.textContent='MATHEMATICAL STUDY / DEMO INPUTS / NO VERIFIED WORK';}
 const card=doc.getElementById('atelier-presets');
 for(let j=0;j<5;j++){const st=kinds[j],id=j===4?42:j+1;const b=doc.createElement('button');b.type='button';b.className='atelier-card';b.innerHTML=atelier({id,style:st,detail:1});const label=doc.createElement('span');label.textContent=st;b.appendChild(label);b.onclick=()=>{controls.id.value=id;controls.style.value=st;draw();box.scrollIntoView({behavior:'smooth',block:'start'});};card.appendChild(b);}
 for(const el of Object.values(controls))el.addEventListener('input',draw);
 doc.getElementById('atelier-export-svg').addEventListener('click',()=>download('proof-'+params(read()).style.toLowerCase()+'-'+read().id+'.svg',atelier(read())));
 doc.getElementById('atelier-export-png').addEventListener('click',()=>{png(social(read()),'proof-social-'+read().id+'.png',2).catch(e=>message.textContent=e.message);});
 doc.getElementById('atelier-export-guidance').addEventListener('click',()=>download('controlnet-guide-'+read().id+'.svg',atelier({...read(),guide:true})));
 doc.getElementById('atelier-copy-prompt').addEventListener('click',()=>{const s=prompt(read());navigator.clipboard?.writeText(s).then(()=>message.textContent='SDXL / CONTROLNET PROMPT COPIED').catch(()=>message.textContent=s);});
 draw();}
const api=Object.freeze({atelier,social,params,prompt,seedOf,kinds});
if(typeof module!=='undefined'&&module.exports)module.exports=api;
if(scope?.document)scope.document.addEventListener('DOMContentLoaded',()=>init(scope.document));
})(typeof window!=='undefined'?window:globalThis);