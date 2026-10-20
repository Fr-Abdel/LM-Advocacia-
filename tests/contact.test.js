const test = require('node:test');
const assert = require('node:assert/strict');
const { validateContact, formatPreview, AREAS } = require('../assets/js/main.js');
const valid = () => ({ name: 'Maria Exemplo', email: 'pessoa@example.com', area: 'civil', message: 'Gostaria de entender um contrato inteiramente fictício.', consent: true });

test('um exemplo válido é aceito em todas as áreas', () => {
  for (const area of Object.keys(AREAS)) assert.deepEqual(validateContact({ ...valid(), area }), {});
});
test('formulário vazio identifica todos os campos obrigatórios', () => {
  assert.deepEqual(Object.keys(validateContact({})), ['name', 'email', 'area', 'message', 'consent']);
});
test('espaços não substituem nome nem mensagem', () => {
  const errors = validateContact({ ...valid(), name: '  ', message: ' '.repeat(30) });
  assert.ok(errors.name);
  assert.ok(errors.message);
});
test('limites inferior e superior são inclusivos', () => {
  for (const [name, message] of [['Ab', 'x'.repeat(20)], ['x'.repeat(80), 'x'.repeat(1000)]]) {
    assert.deepEqual(validateContact({ ...valid(), name, message }), {});
  }
  assert.ok(validateContact({ ...valid(), name: 'A' }).name);
  assert.ok(validateContact({ ...valid(), name: 'x'.repeat(81) }).name);
  assert.ok(validateContact({ ...valid(), message: 'x'.repeat(19) }).message);
  assert.ok(validateContact({ ...valid(), message: 'x'.repeat(1001) }).message);
});
test('endereços inválidos são rejeitados sem alegar verificação de existência', () => {
  for (const email of ['', 'pessoa', 'pessoa@', 'pessoa@exemplo', 'pessoa @example.com', 'a@@example.com', 'a'.repeat(150) + '@example.com']) {
    assert.ok(validateContact({ ...valid(), email }).email, email);
  }
  assert.deepEqual(validateContact({ ...valid(), email: ' nome+demo@example.com ' }), {});
});
test('áreas manipuladas ou herdadas não passam pela validação', () => {
  for (const area of ['invalida', 'constructor', '__proto__', 'toString', '']) {
    assert.ok(validateContact({ ...valid(), area }).area);
  }
});
test('a confirmação exige valor booleano verdadeiro', () => {
  for (const consent of [false, undefined, 'true', 1]) assert.ok(validateContact({ ...valid(), consent }).consent);
});
test('a prévia preserva a mensagem como texto e identifica a ausência de envio', () => {
  const data = { ...valid(), name: ' José Exemplo ', message: '<script>alert("exemplo")</script>\nTexto fictício.' };
  const text = formatPreview(data);
  assert.ok(text.startsWith('PRÉVIA DEMONSTRATIVA — SEM ENVIO'));
  assert.ok(text.includes('Nome: José Exemplo\n'));
  assert.ok(text.includes('Assunto: Direito Civil e Contratos'));
  assert.ok(text.includes(data.message));
});
