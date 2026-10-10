// Public IMD status only. This data cannot authorize minting or an artwork evolution.
(async function refreshIMDSwarm(){
 const $=id=>document.getElementById(id);
 try {
   const r=await fetch('/api/swarm',{cache:'no-store',signal:AbortSignal.timeout(9000)});
   if(!r.ok)throw new Error(`HTTP ${r.status}`);
   const d=await r.json();
   if(d.source!=='IdentityMD public /swarm' || !d.network)throw new Error('Untrusted response');
   const n=d.network;
   for(const [id,key] of [['swarmAgents','agentsOnline'],['swarmJobs','jobsCompleted'],['swarmDaily','jobsDoneLastDay'],['swarmOracle','oraclesDoneLastDay']]){
     const val=n[key];$(id).textContent=Number.isInteger(val)&&val>=0?val.toLocaleString():'—';
   }
   $('swarmStatus').textContent=`Live public network telemetry, fetched at ${new Date(d.fetchedAt).toLocaleString()}. No individual work attestation implied.`;
 } catch(e){$('swarmStatus').textContent='IMD public status unavailable. No live proof or minting claimed.';}
})();
