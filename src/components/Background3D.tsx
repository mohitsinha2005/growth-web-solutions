import { useEffect, useRef } from "react";

// Cosmic particle universe: glowing particles morph between shapes as the visitor scrolls
// (global network → growth bars → rising trend → goal achieved).
const N = 7000;

function shapes() {
  const globe = new Float32Array(N * 3), bars = new Float32Array(N * 3), trend = new Float32Array(N * 3), target = new Float32Array(N * 3);
  const heights = [1.2, 2, 2.6, 3.6, 4.6, 6];
  for (let i = 0; i < N; i++) {
    const k = i * 3, r = Math.random();
    // 1. Global business network: particle globe
    const u = Math.random() * 2 - 1, th = Math.random() * Math.PI * 2, gr = 3.2 + (Math.random() - 0.5) * 0.15;
    const sq = Math.sqrt(1 - u * u);
    globe[k] = sq * Math.cos(th) * gr; globe[k + 1] = u * gr; globe[k + 2] = sq * Math.sin(th) * gr;
    // 2. Growth bar chart: six rising columns
    const col = i % 6, h = heights[col]!;
    bars[k] = (col - 2.5) * 1.3 + (Math.random() - 0.5) * 0.8; bars[k + 1] = -3 + r * h; bars[k + 2] = (Math.random() - 0.5) * 0.8;
    // 3. Rising trend line with arrow head
    if (i % 5 === 0) {
      const t = Math.random(), ax = 4.5 - t * 1.2, ay = 3 - t * 0.2;
      trend[k] = ax + (Math.random() - 0.5) * t * 1.6 * 0.5; trend[k + 1] = ay - t * (Math.random() > 0.5 ? 1 : -0.2); trend[k + 2] = (Math.random() - 0.5) * 0.3;
    } else {
      const t = Math.random(), x = -6 + t * 10.5, y = -3 + t * 6 + Math.sin(t * 14) * 0.45;
      trend[k] = x; trend[k + 1] = y + (Math.random() - 0.5) * 0.3; trend[k + 2] = (Math.random() - 0.5) * 0.6;
    }
    // 4. Target achieved: concentric goal rings
    const ring = i % 4, ta = Math.random() * Math.PI * 2, tr = ring === 0 ? Math.random() * 0.5 : ring * 1.3 + (Math.random() - 0.5) * 0.15;
    target[k] = Math.cos(ta) * tr; target[k + 1] = Math.sin(ta) * tr; target[k + 2] = (Math.random() - 0.5) * 0.3;
  }
  return [globe, bars, trend, target];
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
        c.setHSL(i % 6 === 0 ? 0.38 : 0.58 - Math.random() * 0.08, 0.9, 0.55 + Math.random() * 0.2);
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
        geo.attributes["position"]!.needsUpdate = true;
        points.rotation.y = p < 0.5 ? points.rotation.y + dt * 0.12 : points.rotation.y * (1 - lerp) + Math.sin(now / 4000) * 0.25 * lerp;
        points.rotation.x += ((my * 0.3 + 0) - points.rotation.x) * lerp;
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
