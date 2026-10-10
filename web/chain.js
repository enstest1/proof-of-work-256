// Live chain inspection is isolated from the art simulation.
// No live contracts are presumed. Minting is deliberately disabled until
// a verified deployment manifest is published and the wallet chain matches.
const panel=document.getElementById('chainPanel');
const status=document.getElementById('chainStatus');
const tokenInput=document.getElementById('chainTokenId');
const tokenArt=document.getElementById('chainTokenArt');
const detail=document.getElementById('chainTokenDetail');
const check=document.getElementById('chainCheck');
const mint=document.getElementById('chainMint');
const wallet=document.getElementById('wallet');
let config=null,activeAccount=null;
const isAddress=s=>typeof s==='string'&&/^0x[0-9a-fA-F]{40}$/.test(s);
const word=n=>BigInt(n).toString(16).padStart(64,'0');
function decodeString(hex){
 if(typeof hex!=='string'||!/^0x[0-9a-fA-F]*$/.test(hex))throw Error('Invalid ABI response');
 const payload=hex.slice(2);const start=Number(BigInt('0x'+payload.slice(0,64)))*2;
 if(!Number.isSafeInteger(start)||start+64>payload.length)throw Error('Bad ABI offset');
 const len=Number(BigInt('0x'+payload.slice(start,start+64)));
 if(!Number.isSafeInteger(len)||len>500000||start+64+len*2>payload.length)throw Error('Oversized ABI string');
 const bytes=Uint8Array.from(payload.slice(start+64,start+64+len*2).match(/.{2}/g).map(v=>parseInt(v,16)));
 return new TextDecoder().decode(bytes);
}
function decodeToken(uri){
 if(!uri.startsWith('data:application/json;base64,'))throw Error('Unexpected metadata URI');
 const raw=atob(uri.slice('data:application/json;base64,'.length));
 const meta=JSON.parse(new TextDecoder().decode(Uint8Array.from(raw,c=>c.charCodeAt(0))));
 if(!/^data:image\/svg\+xml;base64,[A-Za-z0-9+/=]+$/.test(meta.image||''))throw Error('Unexpected image source');
 return meta;
}
async function readToken(id){
 if(!window.ethereum)throw Error('No injected wallet available');
 const chain=Number(BigInt(await window.ethereum.request({method:'eth_chainId'})));
 if(chain!==Number(config.chainId))throw Error(`Switch your wallet to ${config.chainName}`);
 const data='0xc87b56dd'+word(id); // ERC721 tokenURI(uint256)
 const raw=await window.ethereum.request({method:'eth_call',params:[{to:config.proofCanvasAddress,data},'latest']});
 return decodeToken(decodeString(raw));
}
async function initialize(){
 try{
  const response=await fetch('./deployment.json',{cache:'no-store'});
  config=await response.json();
  if(!config.deployed||!isAddress(config.proofCanvasAddress)){
   status.textContent='Preview-only: no deployed collection or verified IMD launch has been configured.';
   mint.disabled=true;check.disabled=true;return;
  }
  status.textContent=`Read-only onchain inspection available on ${config.chainName}. Verify the address independently.`;
  if(config.explorer?.startsWith('https://')){
   const a=document.createElement('a');a.href=config.explorer+'/address/'+config.proofCanvasAddress;a.target='_blank';a.rel='noopener noreferrer';a.textContent='VIEW CONTRACT ↗';panel.append(a);
  }
  check.disabled=false;
  mint.disabled=true; // enabled only after matching wallet chain + deployment flag + manual safeguards
 }catch(e){status.textContent='Deployment configuration not available. Gallery remains a simulation.';mint.disabled=true;check.disabled=true;}
}
check.addEventListener('click',async()=>{
  const id=Number(tokenInput.value);
  if(!Number.isSafeInteger(id)||id<1||id>1000000){detail.textContent='Enter a valid numeric token ID.';return;}
  detail.textContent='Reading contract metadata…';tokenArt.replaceChildren();
  try{
   const meta=await readToken(id);
   const img=document.createElement('img');img.src=meta.image;img.alt=meta.name||`Token ${id}`;tokenArt.append(img);
   detail.textContent=`${meta.name||`#${id}`} — authentic metadata returned by the configured contract. ${(meta.attributes||[]).map(a=>`${a.trait_type}: ${a.value}`).join(' · ')}`;
  }catch(e){detail.textContent=`Cannot read onchain token: ${e.message}`;}
});
// NEVER let the demo mint inadvertently. Enable only from deliberate, audited release code.
mint.addEventListener('click',()=>{status.textContent='Minting stays locked until the production deployment and signature flow pass review.';});
initialize();
