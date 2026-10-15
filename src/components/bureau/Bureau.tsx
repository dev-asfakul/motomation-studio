"use client";
// The Bureau: the constant frame around every page. It never reloads.
// Bar (wordmark, case number, evidence tray, UV torch, sound, search, index), the evidence swap between
// pages, Lenis smooth scroll, the UV torch layer and the "enter with sound?" gate.
import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useCase, setCase, getCase } from "@/lib/store";
import { sfx, buzz } from "@/lib/sound";
import { CommandPalette, type SearchItem } from "./CommandPalette";
import { CaseTicker } from "@/components/originals/case-number-ticker";
import type { Swap } from "@/content/exhibits";

export type BureauProps = {
  letters: { letter: string; slug: string; title: string; swap: Swap }[];
  pages: { href: string; name: string; note: string; swap: Swap }[];
  search: SearchItem[];
  caseNo: string;
};

declare global { interface Window { __lenis?: Lenis } }

export function Bureau({ letters, pages, search, caseNo }: BureauProps) {
  const router = useRouter();
  const path = usePathname() || "/";
  const evidence = useCase((s) => s.evidence);
  const uv = useCase((s) => s.uv);
  const sound = useCase((s) => s.sound);
  const asked = useCase((s) => s.soundAsked);
  const [menu, setMenu] = useState(false);
  const [cmdk, setCmdk] = useState(false);
  const [phase, setPhase] = useState<"" | "cover" | "reveal">("");
  const [swap, setSwap] = useState<{ v: Swap; label: string; sub: string }>({ v: "scan-line", label: "", sub: "" });
  const [hydrated, setHydrated] = useState(false);
  const pending = useRef<string | null>(null);
  const markRef = useRef<HTMLSpanElement>(null);
  const torchRef = useRef<HTMLDivElement>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => setHydrated(true), []);

  // ---- smooth scroll (off under reduced motion) ----
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const lenis = new Lenis({ lerp: 0.12, wheelMultiplier: 1, touchMultiplier: 1.2 });
    window.__lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    // width-sprint: the wordmark stretches with scroll speed and relaxes when you stop
    let w = 110;
    lenis.on("scroll", (l: Lenis) => {
      const target = Math.min(150, 110 + Math.abs(l.velocity) * 2.2);
      w += (target - w) * 0.35;
      markRef.current?.style.setProperty("--wdth", w.toFixed(1));
    });
    const relax = setInterval(() => { if (Math.abs(lenis.velocity) < 0.1 && w > 110.5) { w += (110 - w) * 0.3; markRef.current?.style.setProperty("--wdth", w.toFixed(1)); } }, 50);
    return () => { clearInterval(relax); gsap.ticker.remove(tick); lenis.destroy(); window.__lenis = undefined; };
  }, []);

  // ---- UV torch ----
  useEffect(() => {
    document.documentElement.dataset.uv = uv ? "on" : "off";
    if (!uv) return;
    const move = (e: PointerEvent) => { torchRef.current?.style.setProperty("--tx", `${e.clientX}px`); torchRef.current?.style.setProperty("--ty", `${e.clientY}px`); };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [uv]);

  // ---- evidence swap: intercept internal links, cover, navigate, reveal ----
  const variantFor = useCallback((href: string) => {
    const u = new URL(href, location.href);
    const ex = letters.find((l) => u.pathname.startsWith(`/exhibits/${l.slug}`));
    if (ex) return { v: ex.swap, label: `Exhibit ${ex.letter}`, sub: ex.title };
    const p = pages.find((pg) => pg.href !== "/" ? u.pathname.startsWith(pg.href) : u.pathname === "/");
    return p ? { v: p.swap, label: p.note, sub: p.name } : { v: "scan-line" as Swap, label: "Case file", sub: "Evidence" };
  }, [letters, pages]);

  const go = useCallback((href: string, x?: number, y?: number) => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const u = new URL(href, location.href);
    if (u.pathname === location.pathname) { if (u.hash) location.hash = u.hash; else window.__lenis?.scrollTo(0); return; }
    setMenu(false); setCmdk(false);
    if (reduce) { router.push(u.pathname + u.search + u.hash); return; }
    const s = variantFor(href);
    if (x !== undefined && y !== undefined) { document.documentElement.style.setProperty("--sx", `${x}px`); document.documentElement.style.setProperty("--sy", `${y}px`); }
    setSwap(s); setPhase("cover"); pending.current = u.pathname + u.search + u.hash;
    sfx("tick"); buzz(6);
    window.setTimeout(() => { if (pending.current) router.push(pending.current); }, 430);
  }, [router, variantFor]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a || a.target === "_blank" || a.hasAttribute("download") || a.dataset.noswap !== undefined) return;
      const href = a.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
      const u = new URL(href, location.href);
      if (u.origin !== location.origin) return;
      e.preventDefault(); e.stopPropagation();
      go(u.href, e.clientX, e.clientY);
    };
    document.addEventListener("click", onClick, true);
    const onGo = (e: Event) => go((e as CustomEvent<string>).detail);
    window.addEventListener("case:go", onGo);
    return () => { document.removeEventListener("click", onClick, true); window.removeEventListener("case:go", onGo); };
  }, [go]);

  useEffect(() => {
    // a new page arrived: reset scroll, refresh triggers, reveal
    window.__lenis?.scrollTo(0, { immediate: true, force: true });
    if (!location.hash) window.scrollTo(0, 0);
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    if (pending.current) { pending.current = null; setPhase("reveal"); const t = window.setTimeout(() => setPhase(""), 480); return () => { cancelAnimationFrame(id); clearTimeout(t); }; }
    return () => cancelAnimationFrame(id);
  }, [path]);

  // ---- keys: ⌘K / Ctrl+K / "/" search, U torch, Esc ----
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = (e.target as HTMLElement)?.closest?.("input, textarea, [contenteditable=true]");
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) { e.preventDefault(); setCmdk((v) => !v); return; }
      if (typing) return;
      if (e.key === "/") { e.preventDefault(); setCmdk(true); }
      if (e.key === "u" || e.key === "U") setCase((s) => ({ uv: !s.uv }));
      if (e.key === "Escape") { setMenu(false); setCmdk(false); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // ---- verdict unlock ----
  const prevCount = useRef(evidence.length);
  useEffect(() => {
    if (hydrated && evidence.length === 20 && prevCount.current < 20) { setToast("All 20 exhibits logged. The verdict room is open."); sfx("chime", 0.06); }
    prevCount.current = evidence.length;
  }, [evidence.length, hydrated]);

  const lock = menu || cmdk;
  useEffect(() => { if (lock) window.__lenis?.stop(); else window.__lenis?.start(); }, [lock]);

  const exhibitNow = letters.find((l) => path.startsWith(`/exhibits/${l.slug}`));

  return (
    <>
      <a className="skip" href="#main" data-noswap>Skip to the case</a>
      <header className="bureau-bar" role="banner">
        <a href="/" aria-label="Motomation, case opening" className="bureau-mark-link"><span ref={markRef} className="bureau-mark">MOTOMATION</span></a>
        <span className="case-no" aria-label={`Case number ${caseNo}`}>{caseNo} · <CaseTicker /></span>
        {exhibitNow && <span className="label bar-hide-sm" style={{ color: "var(--ink)" }}>Exhibit {exhibitNow.letter} · {exhibitNow.title}</span>}
        <span className="bar-spacer" />
        <nav className="tray" aria-label="Evidence tray, exhibits A to T">
          {letters.map((l) => (
            <a key={l.letter} href={`/exhibits/${l.slug}/`} data-on={hydrated && evidence.includes(l.letter) ? "true" : "false"} aria-current={exhibitNow?.letter === l.letter ? "page" : undefined}
              aria-label={`Exhibit ${l.letter}, ${l.title}${hydrated && evidence.includes(l.letter) ? ", logged" : ""}`}>{l.letter}</a>
          ))}
          <span className="tray-count" aria-live="polite">{hydrated ? evidence.length : 0}/20</span>
        </nav>
        <button type="button" className="bar-btn" aria-pressed={uv} onClick={() => { setCase((s) => ({ uv: !s.uv })); sfx("blip"); }} title="UV torch (U)">
          <span aria-hidden="true">◐</span><span className="bar-hide-sm">UV</span><span className="sr-only">UV torch: reveal hidden annotations</span>
        </button>
        <button type="button" className="bar-btn" aria-pressed={sound} onClick={() => { setCase((s) => ({ sound: !s.sound, soundAsked: true })); setTimeout(() => sfx("tick"), 10); }}>
          <span aria-hidden="true">{sound ? "♪" : "–"}</span><span className="bar-hide-sm">Sound</span><span className="sr-only">Sound</span>
        </button>
        <button type="button" className="bar-btn" onClick={() => setCmdk(true)} aria-haspopup="dialog">
          <span className="bar-hide-sm">Search</span><kbd aria-hidden="true">⌘K</kbd><span className="sr-only">Search the case</span>
        </button>
        <button type="button" className="bar-btn" aria-expanded={menu} aria-controls="case-index" onClick={() => setMenu((v) => !v)}>
          {menu ? "Close" : "Index"}
        </button>
      </header>

      {menu && (
        <nav id="case-index" className="index-panel" aria-label="Case index">
          <p className="label" style={{ marginBottom: 18 }}>Case index · {pages.length} rooms · 20 exhibits</p>
          <ol>
            {pages.map((p, i) => (
              <li key={p.href}><a href={p.href} aria-current={path === p.href ? "page" : undefined}>
                <span className="mono" style={{ color: "var(--muted)" }}>{String(i + 1).padStart(2, "0")}</span>
                <span className="ix-name">{p.name}</span>
                <span className="label" style={{ textAlign: "right" }}>{p.note}</span>
              </a></li>
            ))}
          </ol>
        </nav>
      )}

      {cmdk && <CommandPalette items={search} onClose={() => setCmdk(false)} onGo={(h) => go(h)} />}

      {uv && <div ref={torchRef} className="uv-torch" aria-hidden="true" />}

      <div className="swap" data-phase={phase || undefined} data-v={swap.v} aria-hidden="true">
        <div className="sheet" />
        {phase === "cover" && <p className="swap-label">{swap.label}<b>{swap.sub}</b></p>}
      </div>

      {hydrated && !asked && (
        <div className="toast" role="dialog" aria-label="Sound">
          <p style={{ margin: "0 0 10px" }}>Enter with sound? The case has small synthesised ticks, stamps and rain. It stays silent unless you say yes.</p>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="bar-btn" style={{ borderColor: "#0e0d0b", color: "#0e0d0b" }} onClick={() => { setCase({ sound: true, soundAsked: true }); setTimeout(() => sfx("chime", 0.05), 20); }}>Yes, sound</button>
            <button className="bar-btn" style={{ borderColor: "#0e0d0b", color: "#0e0d0b" }} onClick={() => setCase({ sound: false, soundAsked: true })}>Stay silent</button>
          </div>
        </div>
      )}
      {toast && (
        <div className="toast" role="status">
          <p style={{ margin: "0 0 8px" }}>{toast}</p>
          <a href="/verdict/" onClick={() => setToast(null)}>Enter the verdict room</a>{" "}
          <button className="bar-btn" style={{ marginLeft: 8, borderColor: "#0e0d0b", color: "#0e0d0b" }} onClick={() => setToast(null)}>Dismiss</button>
        </div>
      )}
    </>
  );
}

export function goTo(href: string) { window.dispatchEvent(new CustomEvent("case:go", { detail: href })); }
export { getCase };
