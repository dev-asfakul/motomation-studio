// Screenshots at 390 / 768 / 1440 for milestone reports. Usage: node scripts/shots.mjs <outdir> /path:scrollFrac ...
import { chromium } from "playwright"; import { start } from "./serve.mjs"; import fs from "node:fs";
const [dir, ...targets] = process.argv.slice(2); fs.mkdirSync(dir, { recursive: true });
const srv = await start(4174); const b = await chromium.launch();
const widths = (process.env.W || "390,768,1440").split(",").map(Number);
for (const w of widths) {
  const ctx = await b.newContext({ viewport: { width: w, height: w === 390 ? 844 : w === 768 ? 1024 : 900 }, reducedMotion: process.env.RM ? "reduce" : "no-preference" });
  const pg = await ctx.newPage(); const errs = [];
  pg.on("pageerror", (e) => errs.push(String(e))); pg.on("console", (m) => m.type() === "error" && errs.push(m.text()));
  await pg.addInitScript(() => localStorage.setItem("motomation-case-v1", JSON.stringify({ soundAsked: true })));
  for (const t of targets) {
    const [p, fr = "0"] = t.split(":");
    await pg.goto(`http://localhost:4174${p}`, { waitUntil: "networkidle" });
    await pg.waitForTimeout(500);
    const H = await pg.evaluate(() => document.documentElement.scrollHeight - innerHeight);
    await pg.evaluate((y) => { (window.__lenis ? window.__lenis.scrollTo(y, { immediate: true }) : scrollTo(0, y)); }, Math.round(H * +fr));
    await pg.waitForTimeout(1200);
    const ov = await pg.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    const name = `${dir}/${(p.replace(/\//g, "_") || "_")}-${fr}-${w}${process.env.RM ? "-rm" : ""}.png`;
    await pg.screenshot({ path: name });
    console.log(name, ov > 0 ? `OVERFLOW ${ov}px` : "ok", errs.splice(0).join(" | ").slice(0, 300));
  }
  await ctx.close();
}
await b.close(); srv.close();
