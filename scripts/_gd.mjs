// print the failing details of a gate report
import fs from "node:fs"; const t = JSON.parse(fs.readFileSync(`docs/gate/${process.argv[2]}.json`, "utf8"));
console.log("==", process.argv[2], t.stamp);
const ov = t.overflow.fails || t.overflow; if (ov.length) console.log("O", JSON.stringify(ov.map((x) => `${x.width} ${x.el} "${x.text}" ${x.kind} ${x.px}`)).slice(0, 900));
if (t.words?.length || t.words?.fails?.length) console.log("W", JSON.stringify(t.words.fails || t.words).slice(0, 900));
if (t.contrast.fails.length) console.log("C", JSON.stringify(t.contrast.fails.map((x) => `${x.width} ${x.el} "${x.text}" ${x.ratio}/${x.need} ${x.fg} on ${x.bg} ${x.state}`)).slice(0, 1400));
if (t.contrast.inactiveFails?.length) console.log("CI", JSON.stringify(t.contrast.inactiveFails).slice(0, 600));
if (t.quality.fails) console.log("Q", JSON.stringify({ rm: t.quality.rm, zones: t.quality.zones?.map((z) => ({ l: z.label, ok: z.ok, why: z.why, med: z.medianPct })), smooth: t.quality.smooth?.judged }).slice(0, 900));
const a = t.access; console.log("A", JSON.stringify(a.cat)); for (const k of ["focus", "target", "forced"]) if (a[k].fails.length) console.log(" ", k, JSON.stringify(a[k].fails.map((x) => `${x.el} "${x.text}" ${x.w ? x.w + "x" + x.h : ""}${x.ratio ?? ""}${x.changedPct ?? ""}`)).slice(0, 700));
if (a.zoom.fails.length) console.log("  zoom", JSON.stringify(a.zoom.fails).slice(0, 500)); if (a.reflow.px > 1) console.log("  reflow", a.reflow.px);
for (const k of ["copy", "seo", "perf", "sec"]) if (t.rules[k].fails.length) console.log(" rule", k, JSON.stringify(t.rules[k].fails));
if (t.names?.fails?.length || (Array.isArray(t.names) && t.names.length)) console.log("N", JSON.stringify(t.names).slice(0, 400));
if (t.numbers?.fails?.length) console.log("#", JSON.stringify(t.numbers.fails).slice(0, 400));
