import { useEffect, useRef } from "react";

/** A quiet, architectural growth sculpture shared by every page. */
export function Background3D() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let disposed = false;
    let cleanup = () => {};
    void import("three").then((THREE) => {
      const el = host.current;
      if (disposed || !el) return;
      const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
      const styles = getComputedStyle(document.documentElement);
      const color = (name: string) => styles.getPropertyValue(name).trim();
      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
      } catch { return; }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setClearColor(0, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      el.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-10, 10, 7, -7, 0.1, 100);
      camera.position.set(10, 8, 16);
      camera.lookAt(0, 1.5, 0);
      scene.add(new THREE.HemisphereLight(color("--growth-light"), color("--growth-floor"), 2.4));
      const key = new THREE.DirectionalLight(color("--growth-light"), 3.5);
      key.position.set(-3, 9, 7);
      scene.add(key);
      const rim = new THREE.DirectionalLight(color("--growth-teal"), 2);
      rim.position.set(6, 4, -4);
      scene.add(rim);

      const sculpture = new THREE.Group();
      scene.add(sculpture);
      const geometries: InstanceType<typeof THREE.BufferGeometry>[] = [];
      const materials: InstanceType<typeof THREE.Material>[] = [];
      const metal = new THREE.MeshStandardMaterial({ color: color("--growth-metal"), metalness: 0.45, roughness: 0.3 });
      const teal = new THREE.MeshStandardMaterial({ color: color("--growth-teal"), metalness: 0.35, roughness: 0.28 });
      const baseMaterial = new THREE.MeshStandardMaterial({ color: color("--growth-floor"), metalness: 0.2, roughness: 0.65 });
      const lineMaterial = new THREE.LineBasicMaterial({ color: color("--growth-line"), transparent: true, opacity: 0.22 });
      materials.push(metal, teal, baseMaterial, lineMaterial);
      const heights = [1.1, 1.8, 2.8, 4.1, 5.7];
      const columns = heights.map((height, i) => {
        const geometry = new THREE.BoxGeometry(0.92, height, 1.25);
        geometries.push(geometry);
        const mesh = new THREE.Mesh(geometry, i === 4 ? teal : metal);
        mesh.position.set((i - 2) * 1.42, height / 2, 0);
        sculpture.add(mesh);
        return mesh;
      });
      const baseGeometry = new THREE.BoxGeometry(8.6, 0.18, 4.5);
      geometries.push(baseGeometry);
      const base = new THREE.Mesh(baseGeometry, baseMaterial);
      base.position.y = -0.16;
      sculpture.add(base);
      // Fine architectural grid, not a glowing particle field.
      const gridPoints: InstanceType<typeof THREE.Vector3>[] = [];
      for (let i = -4; i <= 4; i++) {
        gridPoints.push(new THREE.Vector3(i, -0.06, -2.15), new THREE.Vector3(i, -0.06, 2.15));
      }
      for (let i = -2; i <= 2; i++) {
        gridPoints.push(new THREE.Vector3(-4.15, -0.06, i), new THREE.Vector3(4.15, -0.06, i));
      }
      const gridGeometry = new THREE.BufferGeometry().setFromPoints(gridPoints);
      geometries.push(gridGeometry);
      sculpture.add(new THREE.LineSegments(gridGeometry, lineMaterial));
      const curve = new THREE.CatmullRomCurve3(heights.map((height, i) => new THREE.Vector3((i - 2) * 1.42, height + 0.6, 0)));
      const curveGeometry = new THREE.TubeGeometry(curve, 48, 0.035, 6, false);
      geometries.push(curveGeometry);
      sculpture.add(new THREE.Mesh(curveGeometry, teal));

      let raf = 0;
      let last = 0;
      let pointerX = 0;
      let pointerY = 0;
      let scroll = 0;
      const render = () => renderer.render(scene, camera);
      const resize = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const aspect = width / height;
        const span = width < 768 ? 10.5 : 7.3;
        camera.left = -span * aspect;
        camera.right = span * aspect;
        camera.top = span;
        camera.bottom = -span;
        camera.updateProjectionMatrix();
        sculpture.position.set(width < 768 ? 1.7 : aspect * 5, width < 768 ? -2.7 : 0.3, 0);
        const scale = width < 768 ? 0.78 : 1;
        sculpture.scale.setScalar(scale);
        renderer.setSize(width, height);
        render();
      };
      const tick = (now: number) => {
        raf = 0;
        if (document.hidden || motion.matches) return;
        if (now - last >= 32) {
          last = now;
          sculpture.rotation.y += ((pointerX * 0.1 + scroll * 0.07) - sculpture.rotation.y) * 0.05;
          sculpture.rotation.x += (pointerY * 0.025 - sculpture.rotation.x) * 0.05;
          columns.forEach((column, i) => {
            column.scale.y = 1 + Math.sin(now * 0.00045 + i * 0.5) * 0.012;
            column.position.y = (heights[i] ?? 1) * column.scale.y / 2;
          });
          render();
        }
        raf = requestAnimationFrame(tick);
      };
      const resume = () => {
        if (document.hidden || motion.matches) {
          cancelAnimationFrame(raf);
          raf = 0;
          sculpture.rotation.set(0, 0, 0);
          columns.forEach((column, i) => { column.scale.y = 1; column.position.y = (heights[i] ?? 1) / 2; });
          render();
        } else if (!raf) { last = 0; raf = requestAnimationFrame(tick); }
      };
      const onMove = (event: PointerEvent) => {
        pointerX = event.clientX / window.innerWidth - 0.5;
        pointerY = event.clientY / window.innerHeight - 0.5;
      };
      const onScroll = () => { scroll = Math.min(window.scrollY / window.innerHeight, 4); };
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", resize);
      document.addEventListener("visibilitychange", resume);
      motion.addEventListener("change", resume);
      resize();
      resume();
      cleanup = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", resize);
        document.removeEventListener("visibilitychange", resume);
        motion.removeEventListener("change", resume);
        geometries.forEach((geometry) => geometry.dispose());
        materials.forEach((material) => material.dispose());
        renderer.dispose();
        renderer.domElement.remove();
      };
    });
    return () => { disposed = true; cleanup(); };
  }, []);

  return (
    <div className="growth-bg pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div ref={host} className="growth-scene absolute inset-0" />
      <div className="growth-overlay absolute inset-0" />
    </div>
  );
}
