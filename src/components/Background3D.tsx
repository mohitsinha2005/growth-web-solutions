import { useEffect, useRef } from "react";
import bg from "@/assets/bg-growth.jpg";

// Professional business-growth background with 3D mouse + scroll parallax.
export function Background3D() {
  const layer = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let mx = 0, my = 0, cx = 0, cy = 0, scroll = window.scrollY, smoothScroll = scroll, raf = 0;
    const schedule = () => {
      if (!raf && !document.hidden) raf = requestAnimationFrame(tick);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      mx = e.clientX / window.innerWidth - 0.5;
      my = e.clientY / window.innerHeight - 0.5;
      schedule();
    };
    const tick = () => {
      raf = 0;
      cx += (mx - cx) * 0.1;
      cy += (my - cy) * 0.1;
      smoothScroll += (scroll - smoothScroll) * 0.1;
      const sy = Math.min(smoothScroll, 2000) * 0.015;
      if (layer.current) {
        layer.current.style.transform =
          `perspective(1600px) rotateY(${cx * 3}deg) rotateX(${-cy * 2}deg) translate3d(${-cx * 18}px, ${-cy * 12 - sy}px, 0) scale(1.12)`;
      }
      if (Math.abs(mx - cx) + Math.abs(my - cy) > 0.001 || Math.abs(scroll - smoothScroll) > 0.1) schedule();
    };
    const onScroll = () => { scroll = window.scrollY; schedule(); };
    const onVisibility = () => {
      if (document.hidden) { cancelAnimationFrame(raf); raf = 0; }
      else schedule();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    schedule();
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      cancelAnimationFrame(raf);
    };
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
