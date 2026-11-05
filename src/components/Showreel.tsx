import { useEffect, useRef, useState } from "react";
import { Loader2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import videoAsset from "@/assets/bitfarm-company-profile.mp4.asset.json";
import posterAsset from "@/assets/bitfarm-company-profile-poster.jpg.asset.json";

// Company profile video with a professional click-to-play cover.
// The video preloads quietly when the section scrolls into view (or the
// visitor hovers the frame), so pressing play starts instantly.
export function Showreel({ compact = false }: { compact?: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [started, setStarted] = useState(false);
  const [error, setError] = useState(false);

  // Start loading the video as soon as the section is near the viewport.
  useEffect(() => {
    const frame = frameRef.current;
    const video = videoRef.current;
    if (!frame || !video) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          video.preload = "auto";
          video.load();
          observer.disconnect();
        }
      },
      { rootMargin: "400px" },
    );
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  const warmUp = () => {
    const video = videoRef.current;
    if (video && video.preload !== "auto") {
      video.preload = "auto";
      video.load();
    }
  };

  const start = async () => {
    const video = videoRef.current;
    if (!video) return;
    setError(false);
    setStarted(true);
    setBuffering(true);
    try {
      await video.play();
    } catch {
      setStarted(false);
      setBuffering(false);
      setError(true);
    }
  };

  return (
    <section className={compact ? "w-full" : "mx-auto max-w-6xl px-6 py-20"}>
      {!compact && <div className="mx-auto max-w-2xl text-center">
        <span className="rounded-full border border-border px-3 py-1 text-xs text-accent">Company profile</span>
        <h2 className="mt-4 text-3xl font-bold md:text-4xl">See Bitfarm in action</h2>
        <p className="mt-3 text-muted-foreground">
          A short film about who we are, what we build and how we help businesses grow.
        </p>
      </div>}
      <div
        ref={frameRef}
        onPointerEnter={warmUp}
        className={`showreel-frame relative mx-auto ${compact ? "" : "mt-10"} max-w-4xl overflow-hidden rounded-lg border border-border bg-card`}
      >
        <div className="relative aspect-video w-full overflow-hidden bg-background">
        <video
          ref={videoRef}
          src={new URL(videoAsset.url, "https://global-growth-hub-26.lovable.app").href}
          poster={new URL(posterAsset.url, "https://global-growth-hub-26.lovable.app").href}
          controls={started}
          preload="metadata"
          playsInline
          className="block h-full w-full object-contain"
          onPause={() => setPlaying(false)}
          onPlay={() => setPlaying(true)}
          onPlaying={() => setBuffering(false)}
          onWaiting={() => setBuffering(true)}
          onCanPlay={() => setBuffering(false)}
          onError={() => { setBuffering(false); setError(true); }}
        />
        {!started && (
          <Button
            type="button"
            onClick={start}
            variant="ghost"
            aria-label="Play the Bitfarm company profile video"
            className="showreel-play absolute inset-0 h-full w-full items-end justify-end rounded-none p-4 hover:bg-transparent focus-visible:ring-inset"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
              <Play size={20} fill="currentColor" className="ml-0.5" />
            </span>
          </Button>
        )}
        </div>
        <div className="flex min-h-12 items-center justify-between gap-3 border-t border-border px-4 py-3 text-xs">
          <span className="font-semibold text-foreground">Company profile</span>
          <span className="text-muted-foreground" role={error ? "alert" : undefined}>
            {error ? "Unable to play. Please try again." : "Bitfarm"}
          </span>
        </div>
        {playing && buffering && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <Loader2 size={44} className="showreel-spinner text-primary-foreground" aria-label="Video is loading" />
          </div>
        )}
      </div>
    </section>
  );
}
