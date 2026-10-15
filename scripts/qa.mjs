#!/usr/bin/env node
// Layout QA over every built route at 320, 375, 390, 768, 1440 and 1920: page scroll width, elements pushing past the
// viewport, and display text (h1–h3 or ≥ 32px) that breaks a word across lines. Writes docs/qa.json; exits 1 on any.
//   node scripts/qa.mjs [route …]
import fs from "node:fs"; import { chromium } from "playwright"; import { start } from "./serve.mjs";
function routesFromOut() {
  const r = ["/", "/nope-not-a-route/"]; const walk = (d, base) => { for (const f of fs.readdirSync(d)) { if (f.startsWith("_") || f === "404") continue; const p = `${d}/${f}`; if (fs.statSync(p).isDirectory()) { if (fs.existsSync(`${p}/index.html`)) r.push(`${base}${f}/`); walk(p, `${base}${f}/`); } } };
  walk("out", "/"); return r;
}
const W = (process.env.W || "320,375,390,768,1440,1920").split(",").map(Number);
const routes = process.argv.slice(2).length ? process.argv.slice(2) : routesFromOut();
const srv = await start(4181); const b = await chromium.launch({ args: ["--disable-dev-shm-usage"] });
const out = []; let bad = 0;
for (const w of W) {
  const ctx = await b.newContext({ viewport: { width: w, height: 900 }, reducedMotion: process.env.RM ? "reduce" : "no-preference" });
  for (const r of routes) {
    const pg = await ctx.newPage();
    await pg.goto("http://localhost:4181" + r, { waitUntil: "load" }); await pg.waitForTimeout(700);
    const res = await pg.evaluate(() => {
      const vw = innerWidth, sw = document.documentElement.scrollWidth;
      const clipped = (e) => { for (let p = e.parentElement; p; p = p.parentElement) { const s = getComputedStyle(p); if (/(hidden|auto|scroll|clip)/.test(s.overflowX)) return p !== document.body && p !== document.documentElement; } return false; };
      const over = [...document.querySelectorAll("body *")].filter((e) => { const b = e.getBoundingClientRect(); return b.width && b.right > vw + 1 && !clipped(e) && getComputedStyle(e).position !== "fixed"; }).slice(0, 4).map((e) => `${e.tagName.toLowerCase()}.${String(e.className).split(" ")[0]} "${e.textContent.trim().slice(0, 24)}" +${Math.round(e.getBoundingClientRect().right - vw)}px`);
      const breaks = [];
      for (const el of document.querySelectorAll("h1, h2, h3, [class*=title], [class*=display]")) {
        if (!el.offsetParent && getComputedStyle(el).position !== "fixed") continue;
        if (parseFloat(getComputedStyle(el).fontSize) < 32 && !/^H[1-3]$/.test(el.tagName)) continue;
        const tw = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
        for (let n; (n = tw.nextNode());) for (const m of n.textContent.matchAll(/[A-Za-z0-9’'-]{3,}/g)) {
          const rg = document.createRange(); rg.setStart(n, m.index); rg.setEnd(n, m.index + m[0].length);
          const tops = new Set([...rg.getClientRects()].filter((q) => q.width > 1).map((q) => Math.round(q.top / 4)));
          if (tops.size > 1 && !/-/.test(m[0])) breaks.push(`"${m[0]}" in ${el.tagName.toLowerCase()}`);
        }
      }
      return { sw, over, breaks: [...new Set(breaks)].slice(0, 4) };
    });
    const fail = res.sw > w + 1 || res.over.length || res.breaks.length; if (fail) bad++;
    out.push({ route: r, width: w, ok: !fail, ...res });
    if (fail) console.log(`✗ ${w} ${r} sw=${res.sw} ${res.over.join(" · ")} ${res.breaks.join(" · ")}`);
    await pg.close();
  }
  await ctx.close();
}
fs.mkdirSync("docs", { recursive: true }); fs.writeFileSync(process.env.RM ? "docs/qa-rm.json" : "docs/qa.json", JSON.stringify({ generated: new Date().toISOString(), widths: W, routes: routes.length, failures: bad, results: out }, null, 1));
console.log(`qa: ${routes.length} routes × ${W.length} widths, ${bad} failing`);
await b.close(); srv.close(); process.exit(bad ? 1 : 0);
