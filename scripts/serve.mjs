// Tiny static server for out/ (trailingSlash export). Used by shots and gate runs.
import http from "node:http"; import fs from "node:fs"; import path from "node:path";
const main = import.meta.url === `file://${process.argv[1]}`;
const root = path.resolve(main ? process.argv[2] || "out" : process.env.SERVE_ROOT || "out"); const port = main ? +(process.argv[3] || 4173) : 4173;
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".woff2": "font/woff2", ".txt": "text/plain", ".webp": "image/webp", ".avif": "image/avif", ".mp4": "video/mp4", ".webm": "video/webm", ".ico": "image/x-icon", ".xml": "application/xml" };
// send the same headers the deploy sends (vercel.json), so local gate runs see what production serves
const HEADERS = (() => { try { return Object.fromEntries(JSON.parse(fs.readFileSync(path.resolve("vercel.json"), "utf8")).headers[0].headers.map((h) => [h.key, h.value])); } catch { return {}; } })();
export function start(p = port) {
  const srv = http.createServer((req, res) => {
    let u = decodeURIComponent(new URL(req.url, "http://x").pathname);
    let f = path.join(root, u);
    if (!f.startsWith(root)) { res.writeHead(403).end(); return; }
    if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, "index.html");
    if (!fs.existsSync(f) && fs.existsSync(f + ".html")) f += ".html";
    if (!fs.existsSync(f)) { res.writeHead(404, { ...HEADERS, "content-type": types[".html"] }); res.end(fs.readFileSync(path.join(root, "404.html"))); return; }
    res.writeHead(200, { ...HEADERS, "content-type": types[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(res);
  });
  return new Promise((r) => srv.listen(p, () => r(srv)));
}
if (main) start().then(() => console.log(`serving ${root} on http://localhost:${port}`));
