import { chromium } from "playwright"; import { start } from "./serve.mjs";
const srv = await start(4177); const b = await chromium.launch();
const pg = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await pg.goto("http://localhost:4177/", { waitUntil: "networkidle" }); await pg.waitForTimeout(800);
for (let i = 0; i < 40; i++) { await pg.keyboard.press("Tab"); const t = await pg.evaluate(() => { const e = document.activeElement; const r = e.getBoundingClientRect(); return e.closest(".lineup-rail") ? `${e.textContent} y=${Math.round(r.top)} sy=${scrollY} vis=${getComputedStyle(e).visibility} op=${getComputedStyle(e.closest(".lineup-stage")||e).opacity}` : null; }); if (t) { console.log(i, t); await pg.waitForTimeout(300); await pg.screenshot({ path: "/tmp/f.png" }); break; } }
await b.close(); srv.close();
