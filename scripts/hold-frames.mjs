import { chromium } from "playwright"; import { start } from "/home/user/workspace/motomation-studio/scripts/serve.mjs";
const srv = await start(4175); const b = await chromium.launch();
for (const [w,h] of [[1440,900],[390,844]]) {
  const pg = await (await b.newContext({ viewport: { width: w, height: h } })).newPage();
  await pg.addInitScript(() => localStorage.setItem("motomation-case-v1", JSON.stringify({ soundAsked: true })));
  await pg.goto("http://localhost:4175/", { waitUntil: "networkidle" }); await pg.waitForTimeout(600);
  for (const beat of [1,2,3,5,8,12,16,20]) {
    await pg.evaluate((bt) => { const s = document.querySelector(".lineup"); const p = (bt - 1 + 0.85) / 21; const y = s.offsetTop + p * (s.offsetHeight - innerHeight); window.__lenis ? window.__lenis.scrollTo(y, { immediate: true }) : scrollTo(0, y); }, beat);
    await pg.waitForTimeout(1500);
    await pg.screenshot({ path: `/tmp/s/hold-${w}-${beat}.png` });
  }
}
await b.close(); srv.close();
