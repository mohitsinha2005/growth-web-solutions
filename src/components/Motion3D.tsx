import { useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";

// Adds 3D tilt to every .card-lift and a 3D reveal to every <section> on each page.
export function Motion3D() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return;
    const cleanups: (() => void)[] = [];
    document.querySelectorAll<HTMLElement>(".card-lift").forEach((el) => {
      let frame = 0;
      const move = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          el.style.transform = `perspective(1200px) rotateX(${-y * 5}deg) rotateY(${x * 6}deg) translateY(-3px)`;
        });
      };
      const leave = () => { cancelAnimationFrame(frame); el.style.transform = ""; };
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      cleanups.push(() => { leave(); el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); });
    });
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("in-view"); io.unobserve(en.target); }
    }), { threshold: 0.01 });
    document.querySelectorAll("main section").forEach((s) => { s.classList.add("reveal-3d"); io.observe(s); });
    return () => { cleanups.forEach((c) => c()); io.disconnect(); document.querySelectorAll(".reveal-3d").forEach((s) => s.classList.remove("reveal-3d", "in-view")); };
  }, [path]);
  return null;
}
