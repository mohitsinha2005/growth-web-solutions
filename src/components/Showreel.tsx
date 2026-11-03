import { useRef, useState } from "react";
import { Play } from "lucide-react";
import videoAsset from "@/assets/bitfarm-company-profile.mp4.asset.json";
import posterAsset from "@/assets/bitfarm-company-profile-poster.jpg.asset.json";

// Company profile video with a professional click-to-play cover.
export function Showreel() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const start = () => {
    setPlaying(true);
    videoRef.current?.play();
  };

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <span className="rounded-full border border-border px-3 py-1 text-xs text-accent">Company profile</span>
        <h2 className="mt-4 text-3xl font-bold md:text-4xl">See Bitfarm in action</h2>
        <p className="mt-3 text-muted-foreground">
          A short film about who we are, what we build and how we help businesses grow.
        </p>
      </div>
      <div className="card-lift showreel-frame relative mx-auto mt-10 max-w-4xl overflow-hidden rounded-2xl border border-border">
        <video
          ref={videoRef}
          src={videoAsset.url}
          poster={posterAsset.url}
          controls={playing}
          preload="metadata"
          playsInline
          className="aspect-video w-full bg-black object-cover"
          onPause={() => setPlaying(false)}
          onPlay={() => setPlaying(true)}
        />
        {!playing && (
          <button
            type="button"
            onClick={start}
            aria-label="Play the Bitfarm company profile video"
            className="showreel-play absolute inset-0 flex items-center justify-center"
          >
            <span className="showreel-play-ring flex h-20 w-20 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-110">
              <Play size={32} fill="currentColor" className="ml-1" />
            </span>
          </button>
        )}
      </div>
    </section>
  );
}
