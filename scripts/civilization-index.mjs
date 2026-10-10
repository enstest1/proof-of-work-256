// Read-only onchain Civilization index. Authenticated edges come from accepted
// ProofCanvas native IMD Oracle receipts, NOT from decorative graph geometry.
import { JsonRpcProvider, Contract, Interface, ZeroHash, isAddress } from 'ethers';
import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const rpc=process.env.RPC_URL;
const address=process.env.PROOF_CANVAS_ADDRESS;
const start=Number(process.env.START_BLOCK||0);
const output=process.env.OUTPUT_PATH||'evidence/civilization-verified-edges.json';
const abi=[
 'event Collaboration(uint256 indexed a,uint256 indexed b,bytes32 indexed workId)',
 'function nativeReceipts(bytes32) view returns(uint256 canvasA,uint256 canvasB,bytes32 evidenceHash,bytes32 questionHash,bytes32 requestId,uint64 issuedAt,uint16 panelSize,uint16 quorum,uint16 agreed)',
 'function nativeReceiptSourceChainId(bytes32) view returns(uint256)'
];
export function qualifies(edge,receipt){
 const [canvasA,canvasB,evidenceHash,questionHash,requestId,issuedAt,panelSize,quorum,agreed]=receipt;
 return BigInt(canvasA)===BigInt(edge.a)&&BigInt(canvasB)===BigInt(edge.b)&&
  Number(edge.a)>=1&&Number(edge.a)<=256&&Number(edge.b)>=1&&Number(edge.b)<=256&&
  BigInt(edge.a)!==BigInt(edge.b)&&
  requestId!==ZeroHash&&evidenceHash!==ZeroHash&&questionHash!==ZeroHash&&
  Number(issuedAt)>0&&Number(panelSize)>0&&Number(quorum)>0&&Number(agreed)>=Number(quorum)&&Number(agreed)<=Number(panelSize);
}
async function main(){
 if(!rpc||!isAddress(address||'')){console.error('Provide RPC_URL and PROOF_CANVAS_ADDRESS of the independently verified deployed contract. No output written.');process.exitCode=2;return;}
 const provider=new JsonRpcProvider(rpc);const network=await provider.getNetwork();
 const chainId=Number(network.chainId);
 if(![4663,46630].includes(chainId))throw Error('Wrong Robinhood Chain ID '+chainId);
 if(!Number.isSafeInteger(start)||start<1)throw Error('START_BLOCK must be the actual deployment block (>=1), never scan the whole chain');
 const latest=await provider.getBlockNumber();
 const bound=Math.min(latest,Number(process.env.END_BLOCK||latest));
 if(bound<start)throw Error('Block window invalid');
 if(bound-start>100000)throw Error('Limit batch to 100000 blocks; paginate before producing final manifest');
 const code=await provider.getCode(address);if(code==='0x')throw Error('No contract at verified address');
 const contract=new Contract(address,abi,provider);
 const iface=new Interface(abi),collab=iface.getEvent('Collaboration'),topic=collab.topicHash;
 const edges=[],seen=new Set();
 for(let from=start;from<=bound;from+=1500){
  const to=Math.min(bound,from+1499);
  const logs=await provider.getLogs({address,topics:[topic],fromBlock:from,toBlock:to});
  for(const log of logs){
   const parsed=iface.parseLog(log);const a=parsed.args.a,b=parsed.args.b,workId=parsed.args.workId;
   const receipt=await contract.nativeReceipts(workId,{blockTag:bound});
   if(!qualifies({a,b},receipt))continue;
   const key=workId.toLowerCase();if(seen.has(key))continue;seen.add(key);
   const transaction=await provider.getTransactionReceipt(log.transactionHash);
   if(!transaction||transaction.status!==1)continue;
   edges.push({a:Number(a),b:Number(b),workId,oracleRequestId:receipt.requestId,
    panelSize:Number(receipt.panelSize),agreed:Number(receipt.agreed),
    txHash:log.transactionHash,blockNumber:log.blockNumber,
    sourceChainId:Number(await contract.nativeReceiptSourceChainId(workId,{blockTag:bound})),verified:true});
  }
 }
 const result={kind:'PROOF_CIVILIZATION_ONCHAIN_EDGES_V1',chainId,contract:address.toLowerCase(),startBlock:start,endBlock:bound,verifiedCount:edges.length,edges};
 await writeFile(output,JSON.stringify(result,null,2)+'\n',{flag:'wx'});
 console.log('WROTE',output,'VERIFIED_NATIVE_ORACLE_EDGES',edges.length,'NO_TRANSACTION_BROADCAST');
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href)main().catch(e=>{console.error('INDEX_FAILED',e.message);process.exitCode=1;});
