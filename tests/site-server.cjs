/* Servidor apenas de teste, ligado à interface local. */
const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');
const types = {'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.webp':'image/webp'};
async function startServer(directory, base = '/') {
  const root = path.resolve(directory);
  const server = http.createServer(async (req,res) => {
    try {
      const pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
      let status = 200;
      let file = path.resolve(root, pathname.startsWith(base) ? pathname.slice(base.length) || 'index.html' : '404.html');
      if (!pathname.startsWith(base)) status = 404;
      if (!file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
      try { if (!(await fs.stat(file)).isFile()) throw Error(); }
      catch { file = path.join(root,'404.html'); status = 404; }
      const body = await fs.readFile(file);
      res.writeHead(status,{'Content-Type':types[path.extname(file)] || 'application/octet-stream'});
      res.end(body);
    } catch { res.writeHead(400).end(); }
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  return {origin,url:name=>origin+base+name,close:()=>new Promise(resolve=>server.close(resolve))};
}
module.exports = {startServer};
