/* Read-only Robinhood Chain testnet verification: never signs or broadcasts. */
const RPC=process.env.RH_TESTNET_RPC||'https://rpc.testnet.chain.robinhood.com';
const expected=46630;
async function call(method,params=[]){
 const response=await fetch(RPC,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({jsonrpc:'2.0',id:1,method,params}),signal:AbortSignal.timeout(18000)});
 if(!response.ok)throw Error(method+' HTTP '+response.status);
 const data=await response.json();if(data.error)throw Error(method+': '+(data.error.message||'RPC error'));
 if(typeof data.result!=='string'&&typeof data.result!=='object')throw Error(method+': malformed RPC result');
 return data.result;
}
try{
 const chain=Number(BigInt(await call('eth_chainId')));
 if(chain!==expected)throw Error('Unexpected chain '+chain+' (expected '+expected+')');
 const latest=Number(BigInt(await call('eth_blockNumber')));
 if(!Number.isSafeInteger(latest)||latest<1)throw Error('Invalid latest block');
 const block=await call('eth_getBlockByNumber',['0x'+latest.toString(16),false]);
 if(!block||Number(BigInt(block.number))!==latest)throw Error('Block height mismatch');
 const zeroCode=await call('eth_getCode',['0x0000000000000000000000000000000000000001','latest']);
 if(typeof zeroCode!=='string'||!/^0x[0-9a-f]*$/i.test(zeroCode))throw Error('Invalid code response');
 console.log(JSON.stringify({result:'PASS',network:'Robinhood Chain Testnet',chainId:chain,blockNumber:latest,blockHash:block.hash,rpc:RPC,execution:'read-only',broadcast:false},null,2));
}catch(error){console.error('TESTNET_PREFLIGHT_FAILED:',error.message);process.exitCode=1;}
