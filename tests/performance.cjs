/* Medição de laboratório reproduzível. Não estima INP real de usuários. */
const fs = require('node:fs/promises');
const path = require('node:path');
const assert = require('node:assert/strict');
const {chromium} = require('playwright');
const {startServer} = require('./site-server.cjs');
(async()=>{
  const lighthouse = (await import('lighthouse')).default;
  const launcher = await import('chrome-launcher');
  const root = path.resolve(__dirname,'..');
  const out = path.join(root,'test-results/lighthouse');
  await fs.mkdir(out,{recursive:true});
  const server = await startServer(path.join(root,'dist'));
  const chrome = await launcher.launch({chromePath:chromium.executablePath(),chromeFlags:['--headless','--no-sandbox','--disable-dev-shm-usage']});
  const samples=[];
  try {
    for (const [name,route,desktop] of [['inicio-mobile-1','index.html',false],['inicio-mobile-2','index.html',false],['inicio-mobile-3','index.html',false],['inicio-desktop','index.html',true],['contato-mobile','contato.html',false]]) {
      const config = desktop ? {extends:'lighthouse:default',settings:{formFactor:'desktop',screenEmulation:{mobile:false,width:1440,height:900,deviceScaleFactor:1,disabled:false}}} : undefined;
      const result = await lighthouse(server.url(route),{port:chrome.port,logLevel:'error',onlyCategories:['performance','accessibility','best-practices','seo']},config);
      assert.ok(!result.lhr.runtimeError,JSON.stringify(result.lhr.runtimeError));
      await fs.writeFile(path.join(out,`${name}.json`),JSON.stringify(result.lhr));
      const scores=Object.fromEntries(Object.entries(result.lhr.categories).map(([k,v])=>[k,Math.round(v.score*100)]));
      const sample={name,scores,lcpMs:result.lhr.audits['largest-contentful-paint'].numericValue,cls:result.lhr.audits['cumulative-layout-shift'].numericValue,tbtMs:result.lhr.audits['total-blocking-time'].numericValue,settings:result.lhr.configSettings,failedAudits:Object.values(result.lhr.audits).filter(a=>a.score!==null&&a.score<1&&a.scoreDisplayMode!=='informative').map(a=>({id:a.id,title:a.title,description:a.description}))};
      samples.push(sample);
      console.log(JSON.stringify({name,scores,lcpMs:sample.lcpMs,cls:sample.cls,tbtMs:sample.tbtMs}));
    }
    const median=key=>samples.slice(0,3).map(s=>s[key]).sort((a,b)=>a-b)[1];
    const summary={date:new Date().toISOString(),lighthouseVersion:require('lighthouse/package.json').version,environment:`${process.env.GITHUB_ACTIONS ? 'GitHub Actions Ubuntu' : 'Execução local'}; servidor estático local; throttling simulado do Lighthouse`,nodeVersion:process.version,samples,homeMobileMedian:{lcpMs:median('lcpMs'),cls:median('cls'),tbtMs:median('tbtMs')},inp:'não medido; exige instrumentação de interações ou dados reais. TBT não é INP.',seo:'noindex intencional para o projeto fictício; pontuação não é promovida por remoção dessa proteção.'};
    await fs.writeFile(path.join(out,'summary.json'),JSON.stringify(summary,null,2)+'\n');
    assert.ok(summary.homeMobileMedian.lcpMs<=2500,'LCP mediano mobile acima do alvo');
    assert.ok(summary.homeMobileMedian.cls<=0.1,'CLS mediano mobile acima do alvo');
    for (const s of samples) {
      assert.ok(s.scores.performance>=90,`${s.name}: Performance abaixo de90`);
      assert.ok(s.scores.accessibility>=95,`${s.name}: Accessibility abaixo de95`);
      assert.ok(s.scores['best-practices']>=95,`${s.name}: Best Practices abaixo de95`);
    }
  } finally { await chrome.kill(); await server.close(); }
})().catch(error=>{console.error(error);process.exitCode=1;});
