import { lazy, Suspense, useEffect, useState } from "react";

const Scene3D = lazy(() => import("./Scene3D"));

export function Background3D() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden>
      {mounted && (
        <Suspense fallback={null}>
          <Scene3D />
        </Suspense>
      )}
    </div>
  );
}
