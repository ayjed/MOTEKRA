import {spawn} from 'node:child_process';
import {writeFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),cli=require.resolve('lighthouse/cli/index.js');
const results=[];
// Serial runs: do not run other browser/build workloads alongside this script.
for(const desktop of [false,true])for(const path of ['/','/work','/services','/about','/contact']){
 const name=`final-${path==='/'?'home':path.slice(1)}-${desktop?'desktop':'mobile'}`;
 const output=`docs/evidence/phase-09/${name}`;
 const args=[cli,`http://127.0.0.1:3000${path}`,'--output=html','--output=json',`--output-path=${output}`,'--chrome-flags=--headless --no-sandbox --use-angle=swiftshader --enable-unsafe-swiftshader','--quiet',...(desktop?['--preset=desktop']:[])];
 const exit=await new Promise((resolve,reject)=>{const child=spawn(process.execPath,args,{stdio:'inherit'});child.once('error',reject);child.once('exit',resolve);});
 results.push({path,mode:desktop?'desktop':'mobile',exit});
 await writeFile('docs/evidence/phase-09/lighthouse-runs.json',JSON.stringify(results,null,2));
 if(exit!==0)throw Error(`Lighthouse failed for ${name}: ${exit}`);
 console.log(`Saved ${name}`);
}
