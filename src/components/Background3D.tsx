import { useEffect, useRef } from "react";

// Cosmic particle universe: glowing particles morph between shapes as the visitor scrolls
// (energy ring → data helix → growth wave → galaxy).
const N = 7000;

function shapes() {
  const ring = new Float32Array(N * 3), helix = new Float32Array(N * 3), wave = new Float32Array(N * 3), galaxy = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const r = Math.random(), a = Math.random() * Math.PI * 2, k = i * 3;
    // Ring: thick glowing torus shell
    const rr = 3.2 + (Math.random() - 0.5) * 0.7 * Math.sin(a * 6 + r * 4);
    ring[k] = Math.cos(a) * rr; ring[k + 1] = Math.sin(a) * rr; ring[k + 2] = (Math.random() - 0.5) * 0.8;
    // Helix: twisting vertical column
    const t = (i / N) * 2 - 1, ha = t * 9 + (i % 2) * Math.PI, hr = 0.9 + Math.random() * 0.5;
    helix[k] = Math.cos(ha) * hr + (Math.random() - 0.5) * 0.3; helix[k + 1] = t * 5; helix[k + 2] = Math.sin(ha) * hr;
    // Wave: rolling particle surface
    const x = (Math.random() - 0.5) * 16, z = (Math.random() - 0.5) * 8;
    wave[k] = x; wave[k + 1] = Math.sin(x * 0.45) * 0.9 + Math.cos(z * 0.6) * 0.4 - 1.5; wave[k + 2] = z;
    // Galaxy: spiral arms + bright core
    const arm = i % 3, d = Math.pow(Math.random(), 1.6) * 5.5, ga = d * 1.1 + (arm * Math.PI * 2) / 3;
    galaxy[k] = Math.cos(ga) * d + (Math.random() - 0.5) * 0.4; galaxy[k + 1] = (Math.random() - 0.5) * 0.25 * (6 - d) / 6; galaxy[k + 2] = Math.sin(ga) * d + (Math.random() - 0.5) * 0.4;
  }
  return [ring, helix, wave, galaxy];
}

export function Background3D() {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let disposed = false, cleanup = () => {};
    void import("three").then((THREE) => {
      const el = host.current;
      if (disposed || !el) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try { renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: "high-performance" }); } catch { return; }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setSize(window.innerWidth, window.innerHeight);
      el.appendChild(renderer.domElement);
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
      camera.position.set(0, 0, 9);

      const targets = shapes();
      const pos = new Float32Array(targets[0]!);
      const colors = new Float32Array(N * 3);
      const c = new THREE.Color();
      for (let i = 0; i < N; i++) {
        c.setHSL(0.6 - Math.random() * 0.12 + (i % 7 === 0 ? 0.42 : 0), 0.9, 0.55 + Math.random() * 0.2);
        colors.set([c.r, c.g, c.b], i * 3);
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      const mat = new THREE.PointsMaterial({ size: 0.045, vertexColors: true, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false });
      const points = new THREE.Points(geo, mat);
      points.position.x = window.innerWidth > 900 ? 3 : 0;
      scene.add(points);

      const starGeo = new THREE.BufferGeometry();
      const stars = new Float32Array(1500 * 3).map(() => (Math.random() - 0.5) * 60);
      starGeo.setAttribute("position", new THREE.BufferAttribute(stars, 3));
      const starMat = new THREE.PointsMaterial({ size: 0.05, color: 0xbfd4ff, transparent: true, opacity: 0.7, depthWrite: false });
      scene.add(new THREE.Points(starGeo, starMat));

      let mx = 0, my = 0, raf = 0, last = performance.now();
      const onMove = (e: PointerEvent) => { mx = e.clientX / window.innerWidth - 0.5; my = e.clientY / window.innerHeight - 0.5; };
      const onResize = () => { camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight); };
      const tick = (now: number) => {
        raf = 0;
        const dt = Math.min((now - last) / 1000, 0.05); last = now;
        const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
        const p = Math.min(window.scrollY / max, 1) * (targets.length - 1);
        const a = targets[Math.floor(p)]!, b = targets[Math.min(Math.floor(p) + 1, targets.length - 1)]!, f = p - Math.floor(p);
        const ease = f * f * (3 - 2 * f), lerp = 1 - Math.exp(-4 * dt);
        for (let i = 0; i < N * 3; i++) pos[i]! += (a[i]! + (b[i]! - a[i]!) * ease - pos[i]!) * lerp;
        geo.attributes.position!.needsUpdate = true;
        points.rotation.y += dt * 0.08;
        points.rotation.x += ((my * 0.3 + (p > 2.2 ? 0.45 : 0)) - points.rotation.x) * lerp;
        camera.position.x += (mx * 1.2 - camera.position.x) * lerp;
        camera.lookAt(0, 0, 0);
        renderer.render(scene, camera);
        if (!reduce && !document.hidden) raf = requestAnimationFrame(tick);
      };
      const onVis = () => { if (!document.hidden && !raf && !reduce) { last = performance.now(); raf = requestAnimationFrame(tick); } };
      const onScroll = () => { if (reduce) tick(performance.now()); };
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("resize", onResize);
      window.addEventListener("scroll", onScroll, { passive: true });
      document.addEventListener("visibilitychange", onVis);
      raf = requestAnimationFrame(tick);
      cleanup = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("resize", onResize);
        window.removeEventListener("scroll", onScroll);
        document.removeEventListener("visibilitychange", onVis);
        geo.dispose(); mat.dispose(); starGeo.dispose(); starMat.dispose(); renderer.dispose();
        renderer.domElement.remove();
      };
    });
    return () => { disposed = true; cleanup(); };
  }, []);
  return (
    <div className="cosmic-bg pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <div ref={host} className="absolute inset-0" />
      <div className="cosmic-vignette absolute inset-0" />
    </div>
  );
}
