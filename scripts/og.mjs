#!/usr/bin/env node
// public/og.png: the real Home cover, photographed at 1200 × 630 from the built site.
import { chromium } from "playwright"; import { start } from "./serve.mjs";
const srv = await start(4178); const b = await chromium.launch();
const pg = await (await b.newContext({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1, reducedMotion: "reduce" })).newPage();
await pg.goto("http://localhost:4178/", { waitUntil: "networkidle" }); await pg.waitForTimeout(800);
await pg.addStyleTag({ content: ".bureau-bar, .cover-hint, .swap, .toast, [role=dialog] { display: none !important; }" });
await pg.screenshot({ path: "public/og.png" }); await b.close(); srv.close(); console.log("public/og.png");
