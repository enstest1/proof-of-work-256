#!/usr/bin/env node
// Free, read-only IMD checks. No credentials or wallet interactions.
const endpoint = process.env.IMD_API || 'https://api.imd.fun';
const { readFile, writeFile } = await import('node:fs/promises');
const file = new URL('../docs/imd-launch-preflight.json', import.meta.url);
const spec = JSON.parse(await readFile(file, 'utf8'));
async function fetchJson(path, opts) {
  const res = await fetch(endpoint + path, { signal: AbortSignal.timeout(20000), ...opts });
  const body = await res.json();
  if (!res.ok) throw new Error(`${path}: HTTP ${res.status} ${JSON.stringify(body).slice(0,350)}`);
  return body;
}
const caps = await fetchJson('/requests/capabilities');
const supported = caps.actions?.some(a => a.action === 'launch.open');
const checks = await Promise.all(spec.map(async item => {
  const response = await fetchJson('/requests/check', {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ action: item.action, input: item.input })
  });
  return {name: item.name, action:item.action, blockers:response.blockers, suggestions:response.suggestions, kind: response.kind, judged:response.judged, plan:response.plan};
}));
const report = { checkedAt:new Date().toISOString(), supported, launchChains:caps.launches?.chains?.map(c=>({chainId:c.chainId,name:c.name,kinds:c.kinds})), checks };
await writeFile(new URL('../docs/imd-preflight-result.json',import.meta.url), JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
if (!supported || checks.some(c => c.blockers?.length)) process.exitCode = 2;
