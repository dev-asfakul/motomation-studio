"use client";
// @motomation-component
// id: melt-type-shader
// name: Melt Type Shader
// family: backgrounds
// tier: 4
// deps: three
// what: A line of real type rendered to a texture and melted downward by a slow noise displacement in a fragment shader. The pointer warms the type and it runs faster near it.
// use-when: One dreamlike statement on a surreal or uncanny page, where the type itself has to look unreliable.
// avoid-when: Slop on body text, on anything the visitor must read quickly, or as a "cool shader" behind a normal page.
// reduced-motion: The DOM text is shown solid, no shader is created.
// touch: The melt runs on its own clock; touch warms it like the pointer.
// a11y: The visible statement is real DOM text (visually hidden while the canvas is live), so it is read and selectable.
// status: candidate to contribute back to the skill (examples/components/backgrounds)
import { useRef, type CSSProperties } from "react";
import { useGL, textCanvas } from "@/lib/gl";
import { useReducedMotion } from "@/lib/motion";

type Props = { lines: string[]; font: string; ink: string; className?: string; style?: CSSProperties };

const FRAG = `
precision highp float; uniform sampler2D u_tex; uniform float u_t; uniform vec2 u_m; varying vec2 v_uv;
float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f*f*(3.0-2.0*f); return mix(mix(h(i), h(i+vec2(1,0)), u.x), mix(h(i+vec2(0,1)), h(i+vec2(1,1)), u.x), u.y); }
void main(){
  vec2 uv = v_uv; float heat = 1.0 - smoothstep(0.0, 0.45, distance(uv, u_m));
  float drip = n(vec2(uv.x * 18.0, u_t * 0.15)) * (0.06 + heat * 0.08);
  float run = smoothstep(0.25, 1.0, n(vec2(uv.x * 6.0, 3.1))) * 0.07 * (0.5 + 0.5 * sin(u_t * 0.35 + uv.x * 9.0));
  uv.y += drip * (1.0 - uv.y) * 0.6 + run * (1.0 - uv.y);
  uv.x += (n(uv * 4.0 + u_t * 0.05) - 0.5) * 0.01;
  gl_FragColor = texture2D(u_tex, uv);
}`;

export function MeltTypeShader({ lines, font, ink, className, style }: Props) {
  const reduce = useReducedMotion();
  const box = useRef<HTMLDivElement>(null);
  const mode = useGL(box, (THREE, renderer, { w, h }) => {
    const scene = new THREE.Scene(); const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const make = (W: number, H: number) => { const k = Math.min(2, window.devicePixelRatio || 1); const c = textCanvas(lines, { font: font.replace(/(\d+)px/, (_m, s) => `${Math.round(+s * k)}px`), w: Math.round(W * k), h: Math.round(H * k), ink }); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; };
    const u = { u_tex: { value: make(w, h) }, u_t: { value: 0 }, u_m: { value: new THREE.Vector2(-1, -1) } };
    const mat = new THREE.ShaderMaterial({ uniforms: u, transparent: true, vertexShader: "varying vec2 v_uv; void main(){ v_uv = uv; gl_Position = vec4(position, 1.0); }", fragmentShader: FRAG });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat); scene.add(mesh);
    const mv = (e: PointerEvent) => { const r = box.current!.getBoundingClientRect(); u.u_m.value.set((e.clientX - r.left) / r.width, 1 - (e.clientY - r.top) / r.height); };
    window.addEventListener("pointermove", mv, { passive: true });
    document.fonts?.load(font).then(() => { u.u_tex.value.dispose(); const r = box.current?.getBoundingClientRect(); u.u_tex.value = make(r?.width ?? w, r?.height ?? h); });
    return {
      frame: (t) => { u.u_t.value = t; renderer.render(scene, cam); },
      resize: (W, H) => { u.u_tex.value.dispose(); u.u_tex.value = make(W, H); },
      dispose: () => { window.removeEventListener("pointermove", mv); u.u_tex.value.dispose(); mat.dispose(); mesh.geometry.dispose(); },
    };
  }, { enabled: !reduce });
  return (
    <div ref={box} className={`mts ${className ?? ""}`} data-mode={mode} style={{ position: "relative", ...style }}>
      <p className={mode === "live" ? "mts-text sr-only" : "mts-text"} style={{ color: ink }}>{lines.join(" ")}</p>
    </div>
  );
}
