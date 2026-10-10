#!/usr/bin/env node
/* Read-only verification of onchain provenance for a SWARM//DNA score.
   Never infer seat independence from distinct IDs or treat signed quorum as proof of usefulness.
   Usage: RPC_URL=https://... node scripts/verify-swarm-score.mjs evidence/real-score.json */
import { readFile } from 'node:fs/promises';
import { ethers } from 'ethers';
const ADDRESS=/^0x[0-9a-fA-F]{40}$/;
const BYTES=/^0x[0-9a-fA-F]{64}$/;
const assert=(value,message)=>{if(!value)throw Error(message)};
const asUInt=(v,label)=>{let n=BigInt(v);assert(n>=0n&&n<2n**256n,`${label}: invalid uint256`);return n};
const bytes32=(v,label)=>{assert(BYTES.test(v),`${label}: expected bytes32`);return v};
const address=(v,label)=>{assert(ADDRESS.test(v),`${label}: expected address`);return v};
const abi=new ethers.AbiCoder();
const canvasAbi=[
 'function ownerOf(uint256) view returns (address)',
 'function consumedWork(bytes32) view returns (bool)',
 'function nativeReceiptSourceChainId(bytes32) view returns (uint256)',
 'function nativeReceipts(bytes32) view returns (uint256 canvasA,uint256 canvasB,bytes32 evidenceHash,bytes32 questionHash,bytes32 requestId,uint64 issuedAt,uint16 panelSize,uint16 quorum,uint16 agreed)'
];
const scoreAbi=[
 'function scores(bytes32) view returns (uint256 canvasA,uint256 canvasB,bytes32 jobId,bytes32 manifestRoot,bytes32 policyHash,bytes32 questionHash,uint64 committedAt,bool finalized)',
 'function scoreSourceChainId(bytes32) view returns (uint256)',
 'function canonicalRoot(uint256,uint256,uint256,bytes32,bytes32,bytes32[4],bytes32[4]) view returns (bytes32)'
];
export function canonicalRoot(m) {
 const fields=['bytes32','uint256','address','uint256','uint256','uint256','bytes32','bytes32','bytes32[4]','bytes32[4]'];
 const values=[ethers.id('PROOF_SWARM_SCORE_V1'),asUInt(m.deployment.chainId,'chainId'),address(m.deployment.proofCanvas,'proofCanvas'),asUInt(m.sourceChainId,'sourceChainId'),asUInt(m.canvasA,'canvasA'),asUInt(m.canvasB,'canvasB'),bytes32(m.jobId,'jobId'),bytes32(m.policyHash,'policyHash'),m.seats.map((x,i)=>bytes32(x,`seat ${i}`)),m.records.map((x,i)=>bytes32(x,`record ${i}`))];
 return ethers.keccak256(abi.encode(fields,values));
}
export function validateManifest(m) {
 assert(m?.schema==='proof-swarm-score/v1','Wrong manifest schema');
 assert(m.seats?.length===4&&m.records?.length===4,'Exactly four seat and record references required');
 assert(new Set(m.seats.map(s=>s.toLowerCase())).size===4,'Duplicate seat IDs');
 assert(new Set(m.records.map(s=>s.toLowerCase())).size===4,'Duplicate work records');
 bytes32(m.workId,'workId'); bytes32(m.questionHash,'questionHash');
 assert(m.deployment?.proofCanvas&&m.deployment?.swarmRegistry,'No verified deployment addresses');
 assert(asUInt(m.deployment.chainId,'chainId')>0n,'Invalid chain');
 assert(asUInt(m.canvasA,'canvasA')>0n,'Invalid canvas');
 assert(asUInt(m.canvasB,'canvasB')===0n||asUInt(m.canvasB,'canvasB')>asUInt(m.canvasA,'canvasA'),'Invalid collaborator');
 return canonicalRoot(m);
}
async function main() {
 const filename=process.argv[2];
 if(!filename||filename==='--help'){console.log('Usage: RPC_URL=https://... node scripts/verify-swarm-score.mjs evidence/real-score.json\nVerifies contract receipt + matching committed root. Does NOT establish work usefulness or seat independence.');return;}
 const rpc=process.env.RPC_URL;
 assert(/^https?:\/\//.test(rpc||''),'Set RPC_URL for the verified network (read-only)');
 const manifest=JSON.parse(await readFile(filename,'utf8'));
 const expected=validateManifest(manifest);
 const provider=new ethers.JsonRpcProvider(rpc);
 const net=await provider.getNetwork();
 assert(net.chainId===asUInt(manifest.deployment.chainId,'chainId'),'RPC on wrong chain');
 const canvas=new ethers.Contract(address(manifest.deployment.proofCanvas,'proofCanvas'),canvasAbi,provider);
 const registry=new ethers.Contract(address(manifest.deployment.swarmRegistry,'swarmRegistry'),scoreAbi,provider);
 const [score,receipt,source,registeredChain,used]=await Promise.all([
   registry.scores(manifest.workId),canvas.nativeReceipts(manifest.workId),
   canvas.nativeReceiptSourceChainId(manifest.workId),registry.scoreSourceChainId(manifest.workId),
   canvas.consumedWork(manifest.workId)
 ]);
 const canon=await registry.canonicalRoot(manifest.sourceChainId,manifest.canvasA,manifest.canvasB,manifest.jobId,manifest.policyHash,manifest.seats,manifest.records);
 const eq=(a,b)=>String(a).toLowerCase()===String(b).toLowerCase();
 assert(eq(canon,expected),'Local manifest root differs from onchain canonical algorithm');
 const checks={
  jobId:eq(score.jobId,manifest.jobId),
  canvasA:score.canvasA===asUInt(manifest.canvasA,'canvasA')&&receipt.canvasA===score.canvasA,
  canvasB:score.canvasB===asUInt(manifest.canvasB,'canvasB')&&receipt.canvasB===score.canvasB,
  sourceChain:source===asUInt(manifest.sourceChainId,'sourceChainId')&&registeredChain===source,
  manifestRoot:eq(score.manifestRoot,expected)&&eq(receipt.evidenceHash,expected),
  policyHash:eq(score.policyHash,manifest.policyHash),
  questionHash:eq(score.questionHash,manifest.questionHash)&&eq(receipt.questionHash,manifest.questionHash),
  committedBeforeOracle:receipt.issuedAt>=score.committedAt&&score.committedAt>0n,
  verifiedOracleReceipt:!eq(receipt.requestId,ethers.ZeroHash)&&receipt.agreed>=receipt.quorum&&receipt.quorum>0n,
  finalized:score.finalized===true,
  used:used===true
 };
 const ok=Object.values(checks).every(Boolean);
 console.log(JSON.stringify({ok,network:net.chainId.toString(),workId:manifest.workId,root:expected,oracleRequestId:receipt.requestId,checks,
   qualification:'Cryptographic binding of onchain claims ONLY; independent agent work quality and seat attribution require human review of actual linked IMD records.'},null,2));
 if(!ok)process.exitCode=2;
}
main().catch(e=>{console.error(JSON.stringify({ok:false,error:String(e.message||e)}));process.exitCode=1;});
