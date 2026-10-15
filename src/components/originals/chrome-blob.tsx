"use client";
// @motomation-component
// id: chrome-blob
// name: Chrome Blob
// family: backgrounds
// tier: 4
// deps: three
// what: A liquid-chrome blob with real environment reflections (PMREM room environment), its surface breathing with noise. Drag to spin it; it coasts and springs back upright.
// use-when: Y2K, product or playful pages that need one tactile 3D object as the hero, and nothing else in 3D.
// avoid-when: Slop as a floating sphere behind a SaaS headline, or more than one per page.
// reduced-motion: A static rendered poster of the blob (CSS radial chrome); no WebGL.
// touch: Drag with a finger to spin; the page still scrolls vertically (touch-action pan-y).
// a11y: Decorative (aria-hidden canvas); the label beside it carries the meaning.
// status: candidate to contribute back to the skill (examples/components/backgrounds)
import { useRef, type CSSProperties } from "react";
import { useGL } from "@/lib/gl";
import { useReducedMotion } from "@/lib/motion";

type Props = { className?: string; style?: CSSProperties; tint?: string };
export function ChromeBlob({ className, style, tint = "#1E6FD9" }: Props) {
  const reduce = useReducedMotion();
  const box = useRef<HTMLDivElement>(null);
  const spin = useRef({ x: 0, y: 0, vx: 0, vy: 0.004, drag: false, px: 0, py: 0 });
  const mode = useGL(box, (THREE, renderer, { w, h }) => {
    let disposed = false;
    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(35, w / h, 0.1, 50); cam.position.set(0, 0, 6);
    renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.outputColorSpace = THREE.SRGBColorSpace;
    const pm = new THREE.PMREMGenerator(renderer);
    import("three/examples/jsm/environments/RoomEnvironment.js").then(({ RoomEnvironment }) => { if (disposed) return; scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture; });
    const geo = new THREE.IcosahedronGeometry(1.35, 48);
    const base = (geo.attributes.position.array as Float32Array).slice();
    const mat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 1, roughness: 0.06, clearcoat: 1, clearcoatRoughness: 0.05, iridescence: 0.35, iridescenceIOR: 1.6, sheenColor: new THREE.Color(tint) });
    const mesh = new THREE.Mesh(geo, mat); scene.add(mesh);
    const key = new THREE.DirectionalLight(0xffffff, 2); key.position.set(3, 4, 5); scene.add(key);
    const rim = new THREE.PointLight(new THREE.Color(tint), 30, 20); rim.position.set(-3, -2, 2); scene.add(rim);
    const pos = geo.attributes.position as import("three").BufferAttribute; const v = new THREE.Vector3();
    return {
      frame: (t) => {
        const a = pos.array as Float32Array;
        for (let i = 0; i < a.length; i += 3) {
          v.set(base[i], base[i + 1], base[i + 2]).normalize();
          const n = Math.sin(v.x * 3.1 + t * 0.9) * Math.cos(v.y * 2.7 + t * 0.7) * Math.sin(v.z * 2.3 + t * 0.5);
          const k = 1 + n * 0.12; a[i] = base[i] * k; a[i + 1] = base[i + 1] * k; a[i + 2] = base[i + 2] * k;
        }
        pos.needsUpdate = true; geo.computeVertexNormals();
        const s = spin.current; if (!s.drag) { s.vx *= 0.95; s.vy += (0.004 - s.vy) * 0.02; s.x += (0 - s.x) * 0.02; }
        s.x += s.vx; s.y += s.vy; mesh.rotation.set(s.x, s.y, 0);
        renderer.render(scene, cam);
      },
      resize: (W, H) => { cam.aspect = W / H; cam.updateProjectionMatrix(); },
      dispose: () => { disposed = true; geo.dispose(); mat.dispose(); pm.dispose(); scene.environment?.dispose(); },
    };
  }, { enabled: !reduce, cap: 1.5 });
  const down = (e: React.PointerEvent) => { const s = spin.current; s.drag = true; s.px = e.clientX; s.py = e.clientY; (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); };
  const move = (e: React.PointerEvent) => { const s = spin.current; if (!s.drag) return; s.vy = (e.clientX - s.px) * 0.004; s.vx = (e.clientY - s.py) * 0.004; s.px = e.clientX; s.py = e.clientY; };
  const up = () => { spin.current.drag = false; };
  return (
    <div ref={box} className={`cb ${className ?? ""}`} data-mode={mode} aria-hidden="true" style={{ position: "relative", touchAction: "pan-y", cursor: "grab", ...style }} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
      {mode !== "live" && <div className="cb-poster" />}
    </div>
  );
}
