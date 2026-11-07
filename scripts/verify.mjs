// In-process route checks: no browser, no network, isolated synthetic data.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
process.env.ECOBRIDGE_TEST = '1';
process.env.ECOBRIDGE_DATA_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'eco-bridge-check-'));
const { app } = await import('../server.ts');
const results = [];
function route(method, url, body = {}) {
  let status = 200, output;
  const layer = app._router.stack.find(l => l.route?.path === url && l.route.methods[method]);
  if (!layer) throw new Error('Missing route ' + method + ' ' + url);
  layer.route.stack[0].handle({ body, query: {}, params: {} }, {
    status(s) { status = s; return this; },
    json(o) { output = o; return this; },
  });
  return { status, output };
}
function check(name, condition) { results.push({ name, passed: Boolean(condition) }); }
const lot = {title:'Synthetic test',category:'plastic',pricePerUnit:100,amount:50,unit:'кг',location:{lat:0,lng:0,city:'Demo',address:'Synthetic'}};
try {
  check('49 kg rejected', route('post','/api/lots',{...lot,amount:49}).status === 400);
  const valid = route('post','/api/lots',lot);
  check('50 kg accepted', valid.status === 201);
  check('Zero coordinates retained', valid.output.lot.location.lat === 0 && valid.output.lot.location.lng === 0);
  check('0.049 tonnes rejected', route('post','/api/lots',{...lot,amount:.049,unit:'т'}).status === 400);
  check('0.05 tonnes accepted', route('post','/api/lots',{...lot,amount:.05,unit:'т'}).status === 201);
  check('Nonfinite quantity rejected', route('post','/api/lots',{...lot,amount:Infinity}).status === 400);
  check('Negative price rejected', route('post','/api/lots',{...lot,pricePerUnit:-1}).status === 400);
  check('Invalid location rejected', route('post','/api/lots',{...lot,location:{lat:91,lng:0}}).status === 400);
  check('Active lots excluded from completed totals', route('get','/api/stats').output.stats.totalKgRecycled === 0);
  const dbPath=path.join(process.env.ECOBRIDGE_DATA_DIR,'db.json');
  const db=JSON.parse(fs.readFileSync(dbPath,'utf8'));
  db.lots=[{...valid.output.lot,status:'completed'}, {...valid.output.lot,id:'litres',unit:'л',amount:100,status:'completed'}, {...valid.output.lot,id:'paid-only',status:'paid',paid:true}];
  fs.writeFileSync(dbPath,JSON.stringify(db));
  const stats=route('get','/api/stats').output.stats;
  check('Completed kg counted; litres and paid-only excluded from mass',stats.totalKgRecycled === 50);
  check('Only two completed records counted',stats.completedDealsCount === 2);
  const summary={kind:'In-process Express route checks; no user testing',results,passed:results.every(r=>r.passed)};
  const reportPath = path.resolve(process.env.ECOBRIDGE_VERIFICATION_REPORT || 'verification.json');
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath,JSON.stringify(summary,null,2));
  console.log(JSON.stringify(summary,null,2));
  if(!summary.passed) process.exitCode=1;
} finally {
  // Only remove the uniquely created isolated test directory.
  fs.rmSync(process.env.ECOBRIDGE_DATA_DIR,{recursive:true,force:true});
}
