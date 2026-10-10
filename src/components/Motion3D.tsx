import { useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";

// Adds 3D tilt to every .card-lift and a 3D reveal to every <section> on each page.
export function Motion3D() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  useEffect(() => {
    const cleanups: (() => void)[] = [];
    document.querySelectorAll<HTMLElement>(".card-lift").forEach((el) => {
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(900px) rotateX(${-y * 10}deg) rotateY(${x * 12}deg) translateY(-4px)`;
      };
      const leave = () => { el.style.transform = ""; };
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      cleanups.push(() => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); });
    });
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("in-view"); io.unobserve(en.target); }
    }), { threshold: 0.12 });
    document.querySelectorAll("main section").forEach((s) => { s.classList.add("reveal-3d"); io.observe(s); });
    return () => { cleanups.forEach((c) => c()); io.disconnect(); };
  }, [path]);
  return null;
}
