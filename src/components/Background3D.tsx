import { useEffect, useRef } from "react";
import bg from "@/assets/bg-growth.jpg";

// Professional business-growth background with 3D mouse + scroll parallax.
export function Background3D() {
  const layer = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let mx = 0, my = 0, cx = 0, cy = 0, raf = 0;
    const onMove = (e: PointerEvent) => {
      mx = e.clientX / window.innerWidth - 0.5;
      my = e.clientY / window.innerHeight - 0.5;
    };
    const tick = () => {
      cx += (mx - cx) * 0.06;
      cy += (my - cy) * 0.06;
      const sy = Math.min(window.scrollY, 2000) * 0.04;
      if (layer.current) {
        layer.current.style.transform =
          `perspective(1200px) rotateY(${cx * 6}deg) rotateX(${-cy * 4}deg) translate3d(${-cx * 30}px, ${-cy * 20 - sy}px, 0) scale(1.15)`;
      }
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", onMove);
    raf = requestAnimationFrame(tick);
    return () => { window.removeEventListener("pointermove", onMove); cancelAnimationFrame(raf); };
  }, []);
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <div ref={layer} className="bg-zoom absolute inset-0 will-change-transform">
        <img src={bg} alt="" width={1920} height={1088} className="h-full w-full object-cover" />
      </div>
      <div className="bg-overlay absolute inset-0" />
      <div className="bg-gridlines absolute inset-0" />
    </div>
  );
}
