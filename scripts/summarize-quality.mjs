import {readFile,writeFile} from 'node:fs/promises';
const dir='docs/evidence/phase-09',read=async name=>JSON.parse(await readFile(`${dir}/${name}`,'utf8'));
const profiles={};
for(const stage of ['before','after']){
 const data=await read(`${stage}-profile.json`);
 profiles[stage]=data.results.map(row=>{const initial=row.initial.metrics,final=row.final;return {path:row.path,profile:row.profile,lcpMs:initial.lcp.at(-1)?.start??null,cls:final.metrics.shifts.filter(e=>!e.hadRecentInput).reduce((sum,e)=>sum+(e.value??0),0),initialLongTasks:initial.longTasks.length,initialMaxTaskMs:Math.max(0,...initial.longTasks.map(e=>e.duration)),interactionLatencyMaxMs:final.interactionLatencyMaxMs,interactionSamples:final.metrics.events.filter(e=>e.interactionId).length,raf:final.raf,canvasCount:row.initial.canvasCount,sceneStates:final.sceneStates,gpu:final.gpu,scopes:final.profiling?.scopes.map(scope=>({root:scope.root,initMs:scope.initMs,triggers:scope.triggerCount})),orphanTriggers:final.profiling?.orphanTriggers??0,overflow:final.overflow};});
}
const lighthouse=[];
for(const mode of ['mobile','desktop'])for(const route of ['home','work','services','about','contact']){
 const report=await read(`final-${route}-${mode}.report.json`),a=report.audits;
 lighthouse.push({route,mode,scores:Object.fromEntries(Object.entries(report.categories).map(([key,value])=>[key,Math.round(value.score*100)])),lcpMs:a['largest-contentful-paint'].numericValue,tbtMs:a['total-blocking-time'].numericValue,cls:a['cumulative-layout-shift'].numericValue,speedIndexMs:a['speed-index'].numericValue,warnings:report.runWarnings});
}
const result={limitations:'Lab-only observations, not physical device FPS, measured GPU VRAM, field p75 INP or screen-reader speech acceptance. Preview intentionally noindex.',profiles,lighthouse,lifecycle:await read('scene-lifecycle.json')};
await writeFile(`${dir}/metrics-summary.json`,JSON.stringify(result,null,2));
console.log(JSON.stringify({lighthouse,profiles:profiles.after.map(({path,profile,lcpMs,initialMaxTaskMs,interactionLatencyMaxMs,cls,raf})=>({path,mobile:profile.startsWith('390'),lcpMs,initialMaxTaskMs,interactionLatencyMaxMs,cls,medianFps:raf.estimatedMedianCallbackFps,p95Ms:raf.p95Ms}))},null,2));
