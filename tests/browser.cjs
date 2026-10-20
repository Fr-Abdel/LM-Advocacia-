/* Executar com npm run test:browser; navegadores Playwright instalados. */
const assert = require('node:assert/strict');
const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');
const { chromium, firefox } = require('playwright');
const root = path.resolve(__dirname, '..');
const base = '/LM-Advocacia-/';
const pages = ['index.html', 'escritorio.html', 'atuacao.html', 'contato.html', 'privacidade.html', '404.html'];
const output = path.join(root, 'test-results');
const types = {'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml'};
(async () => {
  await fs.mkdir(output, {recursive:true});
  const server = http.createServer(async (req, res) => {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const relative = pathname.startsWith(base) ? pathname.slice(base.length) : '';
    let file = path.resolve(root, relative || 'index.html');
    let status = 200;
    if (!file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
    try { if (!(await fs.stat(file)).isFile()) throw Error(); }
    catch { file = path.join(root, '404.html'); status = 404; }
    res.writeHead(status, {'Content-Type': types[path.extname(file)] || 'application/octet-stream'});
    res.end(await fs.readFile(file));
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  const url = name => origin + base + name;
  const report = {date:new Date().toISOString(), results:[]};
  let browser;
  try {
    for (const engine of [chromium, firefox]) {
      console.log(`Validando ${engine.name()}`);
      browser = await engine.launch();
      const context = await browser.newContext({viewport:{width:1440,height:900}, reducedMotion:'reduce'});
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('response', response => {
        if (response.status() >= 400 && !response.url().includes('inexistente')) errors.push(`${response.status()} ${response.url()}`);
      });
      for (const width of [320,390,768,1024,1440]) {
        await page.setViewportSize({width,height:900});
        for (const name of pages) {
          await page.goto(url(name));
          assert.equal(await page.locator('h1').count(),1);
          const overflow = await page.evaluate(() => ({width:innerWidth, scroll:document.documentElement.scrollWidth}));
          assert.ok(overflow.scroll <= overflow.width, `${engine.name()} ${name} ${width}: overflow ${overflow.scroll}`);
          if (engine === chromium) await page.screenshot({path:path.join(output,`${name.replace('.html','')}-${width}.png`),fullPage:true});
        }
      }
      await page.setViewportSize({width:390,height:844});
      await page.goto(url('index.html'));
      await page.keyboard.press('Tab');
      assert.equal(await page.locator('.skip-link').evaluate(e=>e===document.activeElement),true);
      await page.keyboard.press('Enter');
      assert.equal(await page.locator('main').evaluate(e=>e===document.activeElement),true);
      await page.locator('.menu-toggle').focus();
      await page.keyboard.press('Enter');
      assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'true');
      await page.keyboard.press('Tab');
      assert.equal(await page.locator('#navegacao a').first().evaluate(e=>e===document.activeElement),true);
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'false');
      assert.equal(await page.locator('.menu-toggle').evaluate(e=>e===document.activeElement),true);
      await page.setViewportSize({width:761,height:900});
      await page.locator('#navegacao a').first().focus();
      await page.setViewportSize({width:760,height:900});
      await page.waitForFunction(()=>document.querySelector('.menu-toggle')===document.activeElement, null, {timeout:5000});
      assert.equal(await page.locator('.menu-toggle').evaluate(e=>e===document.activeElement),true);
      await page.goto(url('contato.html?area=civil'));
      assert.equal(await page.locator('#area').inputValue(),'civil');
      await page.locator('button[type=submit]').click();
      assert.equal(await page.locator('#error-summary').evaluate(e=>e===document.activeElement),true);
      assert.equal(await page.locator('#error-summary a').count(),4);
      await page.locator('#error-summary a').first().click();
      assert.equal(await page.locator('#name').evaluate(e=>e===document.activeElement),true);
      await page.locator('#name').fill('Maria Exemplo');
      await page.locator('#email').fill('pessoa@example.com');
      const message = 'Gostaria de analisar um contrato fictício. <img src=x onerror=alert(1)>';
      await page.locator('#message').fill(message);
      await page.locator('#consent').check();
      const requests = [];
      page.on('request', req => requests.push(req.url()));
      await page.locator('button[type=submit]').click();
      assert.equal(await page.locator('#contact-result').evaluate(e=>e===document.activeElement),true);
      assert.ok((await page.locator('#message-preview').textContent()).includes(message));
      assert.equal(await page.locator('#message-preview img').count(),0);
      await page.screenshot({path:path.join(output,`preview-${engine.name()}.png`),fullPage:true});
      await page.evaluate(() => Object.defineProperty(navigator,'clipboard',{value:{writeText:async()=>{throw Error('denied');}},configurable:true}));
      await page.locator('#copy-message').click();
      assert.match(await page.locator('#copy-status').textContent(),/manualmente/);
      await page.locator('#edit-message').click();
      assert.equal(await page.locator('#message').inputValue(),message);
      await page.locator('button[type=submit]').click();
      await page.locator('#new-message').click();
      assert.equal(await page.locator('#name').inputValue(),'');
      assert.equal(await page.locator('#message').inputValue(),'');
      assert.equal(await page.locator('#message-preview').textContent(),'');
      assert.equal(await page.locator('#name').evaluate(e=>e===document.activeElement),true);
      assert.deepEqual(requests,[], 'O formulário não deve gerar requisições');
      assert.equal(await page.evaluate(()=>localStorage.length + sessionStorage.length),0);
      assert.deepEqual(await context.cookies(),[]);
      await page.goto(url('inexistente/exemplo'));
      assert.equal(await page.locator('link[rel=stylesheet]').evaluate(e=>e.sheet!==null),true);
      await page.locator('.brand').click();
      assert.equal(page.url(),url('index.html'));
      const noJS = await browser.newContext({javaScriptEnabled:false,viewport:{width:320,height:900}});
      const fallback = await noJS.newPage();
      for (const name of ['index.html','atuacao.html','contato.html']) {
        await fallback.goto(url(name));
        assert.equal(await fallback.locator('#navegacao').isVisible(),true);
        assert.ok(await fallback.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
      }
      assert.equal(await fallback.locator('#message').isDisabled(),true);
      await fallback.goto(url('atuacao.html'));
      await fallback.locator('summary').first().click();
      assert.equal(await fallback.locator('details').first().getAttribute('open'),'');
      assert.equal(await page.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior),'auto');
      assert.deepEqual(errors,[]);
      if (process.env.LIVE_URL && engine === chromium) {
        const live = process.env.LIVE_URL.replace(/\/$/, '') + '/';
        for (const name of pages) {
          const response = await page.goto(live + name);
          assert.equal(response.status(), 200, `Publicação: ${name}`);
          assert.equal(await page.locator('link[rel=stylesheet]').evaluate(e=>e.sheet!==null), true);
          assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
        }
        for (const width of [390,1440]) {
          await page.setViewportSize({width,height:900});
          await page.goto(live);
          await page.screenshot({path:path.join(output,`live-inicio-${width}.png`),fullPage:true});
        }
        await page.setViewportSize({width:390,height:844});
        await page.goto(live+'contato.html?area=familia');
        assert.equal(await page.locator('#area').inputValue(),'familia');
        await page.locator('#name').fill('Maria Exemplo');
        await page.locator('#email').fill('pessoa@example.com');
        await page.locator('#message').fill('Gostaria de analisar um contrato totalmente fictício.');
        await page.locator('#consent').check();
        await page.locator('button[type=submit]').click();
        assert.equal(await page.locator('#contact-result').isVisible(),true);
        await page.locator('#new-message').click();
        assert.equal(await page.locator('#message').inputValue(),'');
        const missing = await page.goto(live+'inexistente/exemplo');
        assert.equal(missing.status(),404);
        assert.equal(await page.locator('link[rel=stylesheet]').evaluate(e=>e.sheet!==null),true);
        await page.locator('.brand').click();
        assert.ok(['/', '/index', '/index.html'].includes(new URL(page.url()).pathname));
        assert.match(await page.title(),/Início/);
        report.live = {url:live,pages:6,contact:'passed',nested404:'passed'};
      }
      report.results.push({engine:engine.name(),version:browser.version(),pages:6,widths:[320,390,768,1024,1440],flow:'passed',noJS:'passed',networkAndStorage:'passed',nested404:'passed'});
      await noJS.close(); await context.close(); await browser.close(); browser = null;
    }
    console.log(JSON.stringify(report,null,2));
  } finally {
    await fs.writeFile(path.join(output,'browser-report.json'),JSON.stringify(report,null,2)+'\n');
    if (browser) await browser.close();
    await new Promise(resolve=>server.close(resolve));
  }
})().catch(error=>{ console.error(error); process.exitCode=1; });
