/* Integridade da publicação; não substitui testes de navegador ou métricas de campo. */
const fs = require('node:fs/promises');
const path = require('node:path');
const {createHash} = require('node:crypto');

const hash = bytes => createHash('sha256').update(bytes).digest('hex');

function compareContent(expected, actual, html = false) {
  if (expected.equals(actual)) return 'exact';
  if (!html) return 'mismatch';
  const source = expected.toString('utf8');
  const served = actual.toString('utf8');
  const boundary = source.lastIndexOf('</body>');
  if (boundary < 0) return 'mismatch';
  const prefix = source.slice(0, boundary);
  const suffix = source.slice(boundary);
  if (!served.startsWith(prefix) || !served.endsWith(suffix)) return 'mismatch';
  const inserted = served.slice(prefix.length, served.length - suffix.length);
  // O provedor pode inserir um único script Cloudflare antes de </body>.
  // Todo o HTML do projeto continua comparado byte a byte, inclusive o rodapé.
  if (/^<script>[^]*<\/script>$/.test(inserted) &&
      (inserted.match(/<script>/g) || []).length === 1 &&
      (inserted.match(/<\/script>/g) || []).length === 1 &&
      inserted.startsWith('<script>(function(){function c(){') &&
      inserted.endsWith('})();</script>') &&
      inserted.includes('window.__CF$cv$params=') &&
      inserted.includes("a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js'")) {
    return 'cloudflare-injection';
  }
  return 'mismatch';
}

async function listFiles(directory, relative = '') {
  const result = [];
  for (const item of await fs.readdir(path.join(directory, relative), {withFileTypes:true})) {
    const file = relative ? relative + '/' + item.name : item.name;
    if (item.isDirectory()) result.push(...await listFiles(directory, file));
    else if (item.isFile()) result.push(file);
  }
  return result.sort();
}

async function verifyPublication(baseUrl, directory) {
  const base = new URL(baseUrl.endsWith('/') ? baseUrl : baseUrl + '/');
  if (!['http:', 'https:'].includes(base.protocol)) throw Error('LIVE_URL deve ser HTTP(S)');
  const files = await listFiles(directory);
  if (!files.includes('index.html') || !files.includes('404.html')) throw Error('Executar npm run build antes de test:published');
  const results = await Promise.all(files.map(async file => {
    const expected = await fs.readFile(path.join(directory, file));
    try {
      const response = await fetch(new URL(file, base), {cache:'no-store',signal:AbortSignal.timeout(15000)});
      const actual = Buffer.from(await response.arrayBuffer());
      const sameOrigin = new URL(response.url).origin === base.origin;
      const comparison = compareContent(expected, actual, file.endsWith('.html'));
      return {file,status:response.status,url:response.url,comparison,
        expectedSha256:hash(expected),servedSha256:hash(actual),
        passed:response.status === 200 && sameOrigin && comparison !== 'mismatch'};
    } catch (error) {
      return {file,passed:false,error:error.message};
    }
  }));
  return {date:new Date().toISOString(),sourceCommit:process.env.GITHUB_SHA || null,
    url:base.href,files:results,passed:results.every(result=>result.passed),
    scope:'Conteúdo do pacote dist; permite somente a inserção Cloudflare identificada. Não mede UX, privacidade do provedor ou desempenho público.'};
}

if (require.main === module) {
  (async()=>{
    if (!process.env.LIVE_URL) throw Error('Definir LIVE_URL explicitamente; não há acesso externo implícito');
    const root = path.resolve(__dirname, '..');
    const report = await verifyPublication(process.env.LIVE_URL, path.join(root, 'dist'));
    await fs.mkdir(path.join(root, 'test-results'), {recursive:true});
    await fs.writeFile(path.join(root, 'test-results/published-report.json'), JSON.stringify(report,null,2)+'\n');
    console.log(JSON.stringify(report,null,2));
    if (!report.passed) process.exitCode = 1;
  })().catch(error=>{console.error(error);process.exitCode=1;});
}
module.exports = {compareContent, verifyPublication};
