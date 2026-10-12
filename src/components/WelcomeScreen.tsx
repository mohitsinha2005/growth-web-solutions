import { useEffect, useState, type ReactNode } from "react";
import logo from "@/assets/logo.png";
import growth from "@/assets/bg-growth.jpg";

export function WelcomeScreen({ children }: { children: ReactNode }) {
  const [welcoming, setWelcoming] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setWelcoming(false), 3000);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!welcoming) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [welcoming]);

  return (
    <>
      {welcoming && (
        <div role="status" aria-label="Welcome to Brightlane Digital" className="welcome-screen fixed inset-0 z-[100] flex min-h-dvh items-center justify-center overflow-hidden bg-background px-6 text-center">
          <img src={growth} alt="" className="welcome-backdrop absolute inset-0 h-full w-full object-cover" />
          <div className="bg-overlay absolute inset-0" />
          <div className="welcome-growth absolute bottom-0 right-0" aria-hidden="true">
            <div className="welcome-growth-stage">
              <span className="welcome-column"><i /><b /></span>
              <span className="welcome-column"><i /><b /></span>
              <span className="welcome-column"><i /><b /></span>
              <span className="welcome-column"><i /><b /></span>
            </div>
          </div>
          <div className="welcome-brand relative mx-auto flex w-full max-w-2xl flex-col items-center">
            <img src={logo} alt="" width={88} height={88} className="welcome-logo mb-8 h-[88px] w-[88px] object-contain" />
            <p className="mb-4 text-xs font-semibold uppercase text-accent">Technology. Strategy. Growth.</p>
            <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl">Brightlane Digital</h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">Building your next chapter of business growth.</p>
            <div className="mt-10 h-0.5 w-40 overflow-hidden bg-border" aria-hidden="true"><div className="welcome-progress h-full w-full origin-left bg-accent" /></div>
          </div>
        </div>
      )}
      <div inert={welcoming} aria-hidden={welcoming || undefined}>{children}</div>
    </>
  );
}