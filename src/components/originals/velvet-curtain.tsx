"use client";
// @motomation-component
// id: velvet-curtain
// name: Velvet Curtain
// family: scroll
// tier: 2
// deps: react, gsap
// what: Two heavy velvet panels (folds from layered gradients, a gold fringe) that part on entry with a weighted ease and a slight gather at the top, and draw closed again when the section leaves the viewport, ready to part on return.
// use-when: A single theatrical reveal on archival, period or stage pages; the content behind must stand on its own once open.
// avoid-when: Slop as a page loader, on every section, or hiding content that must be read on arrival (it opens within a second).
// reduced-motion: The curtains are drawn open and tied back at the sides; no motion.
// touch: Same; it never blocks taps once open (pointer-events none).
// a11y: Decorative (aria-hidden); content behind is in the DOM and reachable at all times.
// status: candidate to contribute back to the skill (examples/components/scroll)
import { useRef, type CSSProperties } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/motion";
type Props = { color?: string; className?: string; style?: CSSProperties };
export function VelvetCurtain({ color = "#5b0f1a", className, style }: Props) {
  const reduce = useReducedMotion(); const root = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    if (reduce) return; const L = ".vc-l", R = ".vc-r";
    const open = () => gsap.to([L, R], { xPercent: (i) => (i ? 92 : -92), scaleX: 0.55, skewY: (i) => (i ? -2 : 2), duration: 1.5, ease: "power3.inOut", overwrite: true });
    const close = () => gsap.to([L, R], { xPercent: 0, scaleX: 1, skewY: 0, duration: 0.9, ease: "power2.inOut", overwrite: true });
    const io = new IntersectionObserver(([en]) => (en.isIntersecting ? open() : close()), { threshold: 0.15 });
    io.observe(root.current!); return () => io.disconnect();
  }, { scope: root, dependencies: [reduce] });
  const panel = (side: "l" | "r") => <div className={`vc-p vc-${side}`} style={{ ["--vc" as string]: color, transformOrigin: side === "l" ? "0 0" : "100% 0", ...(reduce ? { transform: `translateX(${side === "l" ? -92 : 92}%) scaleX(0.55)` } : {}) } as CSSProperties} />;
  return <div ref={root} className={`vc ${className ?? ""}`} style={style} aria-hidden="true">{panel("l")}{panel("r")}<div className="vc-pelmet" /></div>;
}
