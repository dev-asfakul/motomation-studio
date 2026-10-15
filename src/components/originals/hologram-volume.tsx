"use client";
// @motomation-component
// id: hologram-volume
// name: Hologram Volume
// family: backgrounds
// tier: 4
// deps: react, three (lazy)
// what: A point-cloud volume of stacked layers (one per data group, density from its count) with additive light, HUD rings and a clipping plane you move to cut the volume. Drag to orbit with damping; no auto-orbit.
// use-when: Futuristic or data pages where a structure (folders, layers, strata) should be explored in space and sliced.
// avoid-when: Slop as a spinning decorative globe or particle swarm with nothing to read; never without the poster path.
// reduced-motion: The poster: still plates for each layer with their counts; no orbit.
// touch: One-finger drag orbits inside the canvas only (touch-action pan-y keeps vertical page scroll).
// a11y: The canvas is decorative; the caller renders the same layers as text (the slice readout).
// status: candidate to contribute back to the skill (examples/components/backgrounds)
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { useGL } from "@/lib/gl";
import { useReducedMotion } from "@/lib/motion";

type Layer = { name: string; count: number };
type Props = { layers: Layer[]; slice: number; ink: string; accent: string; poster: ReactNode; className?: string; style?: CSSProperties };
export function HologramVolume({ layers, slice, ink, accent, poster, className, style }: Props) {
  const reduce = useReducedMotion(); const box = useRef<HTMLDivElement>(null); const sliceRef = useRef(slice);
  useEffect(() => { sliceRef.current = slice; }, [slice]);
  const mode = useGL(box, (THREE, renderer, { w, h }) => {
    renderer.localClippingEnabled = true;
    const scene = new THREE.Scene(); const cam = new THREE.PerspectiveCamera(38, w / h, 0.1, 100); cam.position.set(0, 1.2, 9);
    const root = new THREE.Group(); scene.add(root);
    const N = layers.length, H = 5; const plane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 0);
    const pos: number[] = [], col: number[] = []; const ci = new THREE.Color(ink), ca = new THREE.Color(accent);
    layers.forEach((l, i) => { const y = -H / 2 + (i / Math.max(1, N - 1)) * H; const n = 220 + l.count * 22; for (let k = 0; k < n; k++) { const a = Math.random() * Math.PI * 2, r = Math.sqrt(Math.random()) * (1.2 + (l.count % 7) * 0.12); pos.push(Math.cos(a) * r * 1.4, y + (Math.random() - 0.5) * 0.08, Math.sin(a) * r); const c = i % 3 === 0 ? ca : ci; col.push(c.r, c.g, c.b); } });
    const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
    const m = new THREE.PointsMaterial({ size: 0.035, vertexColors: true, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false, clippingPlanes: [plane] });
    root.add(new THREE.Points(g, m));
    const ringM = new THREE.MeshBasicMaterial({ color: accent, transparent: true, opacity: 0.8, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(new THREE.RingGeometry(2.3, 2.34, 96), ringM); ring.rotation.x = -Math.PI / 2; root.add(ring);
    const hud = new THREE.Mesh(new THREE.RingGeometry(2.9, 2.91, 128), new THREE.MeshBasicMaterial({ color: ink, transparent: true, opacity: 0.25, side: THREE.DoubleSide })); hud.rotation.x = -Math.PI / 2; hud.position.y = -H / 2 - 0.2; root.add(hud);
    let yaw = 0.5, pitch = 0.18, vy = 0, vp = 0, drag = false, lx = 0, ly = 0;
    const el = renderer.domElement; el.style.touchAction = "pan-y"; el.style.cursor = "grab";
    const dn = (e: PointerEvent) => { drag = true; lx = e.clientX; ly = e.clientY; el.setPointerCapture(e.pointerId); };
    const mv = (e: PointerEvent) => { if (!drag) return; vy = (e.clientX - lx) * 0.004; vp = (e.clientY - ly) * 0.003; lx = e.clientX; ly = e.clientY; };
    const up = () => { drag = false; };
    el.addEventListener("pointerdown", dn); el.addEventListener("pointermove", mv); el.addEventListener("pointerup", up);
    let cur = sliceRef.current;
    return {
      frame: () => {
        yaw += vy; pitch = Math.max(-0.5, Math.min(0.8, pitch + vp)); vy *= 0.93; vp *= 0.9; root.rotation.set(pitch, yaw, 0);
        cur += (sliceRef.current - cur) * 0.12; const y = -H / 2 + cur * H + 0.05; plane.constant = y; ring.position.y = y; ringM.opacity = 0.5 + 0.4 * Math.abs(Math.sin(performance.now() / 900));
        renderer.render(scene, cam);
      },
      resize: (W, Hh) => { cam.aspect = W / Hh; cam.updateProjectionMatrix(); },
      dispose: () => { el.removeEventListener("pointerdown", dn); el.removeEventListener("pointermove", mv); el.removeEventListener("pointerup", up); g.dispose(); m.dispose(); ringM.dispose(); },
    };
  }, { enabled: !reduce });
  return <div ref={box} className={`hv ${className ?? ""}`} data-mode={mode} style={{ position: "relative", ...style }}>{mode !== "live" && poster}</div>;
}
