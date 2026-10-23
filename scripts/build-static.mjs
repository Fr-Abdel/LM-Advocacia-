import { cp, rm, readdir, mkdir, readFile, writeFile } from 'node:fs/promises';
const base = process.argv[2] || '/';
if (!/^\/(?:[A-Za-z0-9_-]+\/)*$/.test(base)) throw Error('Base deve ser / ou /nome-do-projeto/');
await mkdir('dist', { recursive: true });
for (const name of await readdir('dist')) await rm(`dist/${name}`, {recursive:true, force:true});
for (const name of ['index.html','escritorio.html','atuacao.html','contato.html','privacidade.html','404.html']) {
  let html = await readFile(name, 'utf8');
  if (name === '404.html') html = html.replace('<base href="/LM-Advocacia-/">', `<base href="${base}">`);
  await writeFile(`dist/${name}`, html);
}
await cp('assets', 'dist/assets', { recursive: true });
console.log(`Site estático preparado em dist/ para ${base}`);
