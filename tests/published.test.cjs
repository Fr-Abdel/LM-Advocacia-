const test = require('node:test');
const assert = require('node:assert/strict');
const {compareContent} = require('./published.cjs');
const html = Buffer.from('<html><body>Projeto fictício</body></html>\n');
const provider = "<script>(function(){function c(){window.__CF$cv$params={r:'exemplo'};a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';}})();</script>";
const append = script => Buffer.from(html.toString().replace('</body>', script+'</body>'));

test('publicação aceita conteúdo idêntico, incluindo assets binários', () => {
  assert.equal(compareContent(html,html,true),'exact');
  assert.equal(compareContent(Buffer.from([0,255]),Buffer.from([0,255])),'exact');
});
test('publicação identifica somente a inserção conhecida do provedor', () => {
  assert.equal(compareContent(html,append(provider),true),'cloudflare-injection');
});
test('publicação rejeita alteração no conteúdo mesmo com a inserção do provedor', () => {
  const changed = Buffer.from(append(provider).toString().replace('Projeto fictício','Projeto antigo'));
  assert.equal(compareContent(html,changed,true),'mismatch');
});
test('publicação rejeita scripts adicionais ou inserção não reconhecida', () => {
  assert.equal(compareContent(html,append('<script>alert(1)</script>'),true),'mismatch');
  assert.equal(compareContent(html,append(provider+'<script>alert(1)</script>'),true),'mismatch');
  assert.equal(compareContent(html,append(provider+'<p>Conteúdo extra</p>'),true),'mismatch');
});
test('publicação rejeita alteração em CSS, JavaScript e SVG sem normalização', () => {
  assert.equal(compareContent(Buffer.from('atual'),Buffer.from('antigo')),'mismatch');
  assert.equal(compareContent(html,append(provider)),'mismatch');
});
test('publicação rejeita página de erro ou HTML sem o conteúdo esperado', () => {
  assert.equal(compareContent(html,Buffer.from('<html>Login</html>'),true),'mismatch');
  assert.equal(compareContent(Buffer.from('sem body'),append(provider),true),'mismatch');
});
