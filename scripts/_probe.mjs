import { chromium } from "playwright"; import { start } from "./serve.mjs";
const [path, w, js] = process.argv.slice(2);
const srv = await start(4177); const b = await chromium.launch();
const pg = await (await b.newContext({ viewport: { width: +w, height: 844 } })).newPage();
await pg.goto("http://localhost:4177" + path, { waitUntil: "networkidle" }); await pg.waitForTimeout(500);
console.log(JSON.stringify(await pg.evaluate(js), null, 1));
await b.close(); srv.close();
