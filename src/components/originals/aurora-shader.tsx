"use client";
// @motomation-component
// id: aurora-shader
// name: Aurora Shader
// family: backgrounds
// tier: 4
// deps: react, three (lazy)
// what: Aurora curtains in one fragment shader: folded vertical rays from layered noise, a hem that bends toward the pointer, and an `hour` input (0–6) that moves the display from first glow through the 3 AM peak to dawn. Full-screen quad, one draw call.
// use-when: Night, calm or time-of-night pages where the sky itself carries the story; text sits on its own dark panels.
// avoid-when: Slop as a generic "aurora gradient" hero behind a SaaS headline; never as the only carrier of meaning.
// reduced-motion: A CSS gradient poster tinted for the current hour; no shader.
// touch: Touch points stir it too; never blocks scroll.
// a11y: Decorative (aria-hidden). Paused off screen and in hidden tabs; DPR capped at 1.5.
// status: candidate to contribute back to the skill (examples/components/backgrounds)
import { useEffect, useRef, type CSSProperties } from "react";
import { useGL } from "@/lib/gl";
import { useReducedMotion } from "@/lib/motion";

const FRAG = `
precision highp float; uniform float u_t; uniform float u_hour; uniform vec2 u_m; uniform vec2 u_res; varying vec2 v_uv;
float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f*f*(3.0-2.0*f); return mix(mix(h(i), h(i+vec2(1,0)), u.x), mix(h(i+vec2(0,1)), h(i+vec2(1,1)), u.x), u.y); }
float fbm(vec2 p){ float s = 0.0, a = 0.5; for (int i = 0; i < 4; i++) { s += a * n(p); p *= 2.03; a *= 0.5; } return s; }
void main(){
  vec2 uv = v_uv; float asp = u_res.x / u_res.y;
  float peak = exp(-pow((u_hour - 3.2) / 1.5, 2.0)); float dawn = smoothstep(4.6, 6.0, u_hour);
  vec3 sky = mix(vec3(0.03, 0.04, 0.035), vec3(0.16, 0.13, 0.20), dawn);
  float pull = exp(-pow((uv.x - u_m.x) * asp * 2.2, 2.0)) * 0.12 * step(0.0, u_m.x);
  float hem = 0.34 + 0.06 * sin(uv.x * 5.0 + u_t * 0.15) + 0.05 * fbm(vec2(uv.x * 3.0, u_t * 0.05)) - pull;
  float folds = fbm(vec2(uv.x * 7.0 + fbm(vec2(uv.x * 2.0, u_t * 0.04)) * 2.5, u_t * 0.06));
  float rays = pow(folds, 2.2) * 2.4;
  float body = smoothstep(hem - 0.02, hem + 0.05, uv.y) * exp(-(uv.y - hem) * 2.6);
  float a = clamp(body * rays, 0.0, 1.0) * (0.35 + 0.9 * peak) * (1.0 - dawn * 0.8);
  vec3 green = vec3(0.16, 0.58, 0.44), violet = vec3(0.45, 0.30, 0.70);
  vec3 col = mix(green, violet, smoothstep(hem + 0.1, hem + 0.55, uv.y));
  float stars = step(0.9975, h(floor(uv * u_res / 2.0))) * (1.0 - dawn) * (0.6 + 0.4 * sin(u_t * 2.0 + uv.x * 40.0));
  gl_FragColor = vec4(sky + col * a + vec3(stars) * 0.8, 1.0);
}`;
type Props = { hour: number; className?: string; style?: CSSProperties };
export function AuroraShader({ hour, className, style }: Props) {
  const reduce = useReducedMotion(); const box = useRef<HTMLDivElement>(null); const hr = useRef(hour);
  useEffect(() => { hr.current = hour; }, [hour]);
  const mode = useGL(box, (THREE, renderer, { w, h }) => {
    const scene = new THREE.Scene(); const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const u = { u_t: { value: 0 }, u_hour: { value: hr.current }, u_m: { value: new THREE.Vector2(-1, -1) }, u_res: { value: new THREE.Vector2(w, h) } };
    const mat = new THREE.ShaderMaterial({ uniforms: u, vertexShader: "varying vec2 v_uv; void main(){ v_uv = uv; gl_Position = vec4(position, 1.0); }", fragmentShader: FRAG });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat); scene.add(mesh); let mx = -1;
    const mv = (e: PointerEvent) => { const r = box.current!.getBoundingClientRect(); mx = (e.clientX - r.left) / r.width; };
    window.addEventListener("pointermove", mv, { passive: true });
    return {
      frame: (t) => { u.u_t.value = t; u.u_hour.value += (hr.current - u.u_hour.value) * 0.08; u.u_m.value.x += ((mx < 0 ? -1 : mx) - u.u_m.value.x) * 0.05; renderer.render(scene, cam); },
      resize: (W, H) => u.u_res.value.set(W, H),
      dispose: () => { window.removeEventListener("pointermove", mv); mat.dispose(); mesh.geometry.dispose(); },
    };
  }, { enabled: !reduce, cap: 1.5 });
  const peak = Math.exp(-Math.pow((hour - 3.2) / 1.5, 2)); const dawn = Math.max(0, Math.min(1, (hour - 4.6) / 1.4));
  return (
    <div ref={box} className={className} data-mode={mode} aria-hidden="true" style={{ position: "absolute", inset: 0, ...style,
      background: mode === "live" ? "#0a0b09" : `radial-gradient(ellipse 90% 40% at 50% 62%, rgba(41,147,113,${(0.25 + peak * 0.5) * (1 - dawn * 0.8)}), transparent 70%), radial-gradient(ellipse 70% 30% at 40% 85%, rgba(115,77,180,${0.1 + peak * 0.3}), transparent 70%), linear-gradient(180deg, ${dawn > 0 ? `rgba(60,48,72,${dawn})` : "#0a0b09"}, #0a0b09)` }} />
  );
}
