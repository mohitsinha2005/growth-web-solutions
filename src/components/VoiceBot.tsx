import { useCallback, useState } from "react";
import { useLiveVoice, type LiveEvent } from "@/hooks/use-live-voice";

type Line = { who: "you" | "nova"; text: string };

export function VoiceBot() {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<Line[]>([]);

  const onEvent = useCallback((e: LiveEvent) => {
    const t = e.type as string;
    const delta = (e as { delta?: string }).delta;
    if (!delta) return;
    const who = t === "session.input_transcript.delta" ? "you" : t === "session.output_transcript.delta" ? "nova" : null;
    if (!who) return;
    setLines((prev) => {
      const last = prev[prev.length - 1];
      if (last && last.who === who) return [...prev.slice(0, -1), { who, text: last.text + delta }];
      return [...prev.slice(-30), { who, text: delta }];
    });
  }, []);

  const voice = useLiveVoice({ onEvent });
  const idle = voice.status === "idle" || voice.status === "closed";

  const launch = () => {
    setOpen(true);
    if (idle) { setLines([]); voice.start(); }
  };
  const close = () => { voice.stop(); setOpen(false); };

  const label =
    voice.status === "connecting" ? "Connecting…" :
    voice.status === "connected" ? (voice.muted ? "Muted" : "Listening — just speak") :
    voice.status === "stopping" ? "Ending call…" : "Call ended";

  return (
    <>
      <audio ref={voice.audioRef} className="hidden" />
      {open && (
        <div className="fixed bottom-24 right-5 z-[60] w-[min(360px,calc(100vw-2.5rem))] overflow-hidden rounded-3xl border border-border bg-card/95 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-3 border-b border-border p-4">
            <div className={`orb ${voice.status === "connected" ? "orb-live" : ""}`} />
            <div className="flex-1">
              <p className="font-display font-semibold">Nova · AI Assistant</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
            <button onClick={close} aria-label="Close assistant" className="text-muted-foreground hover:text-foreground">✕</button>
          </div>
          <div className="max-h-72 space-y-3 overflow-y-auto p-4 text-sm">
            {lines.length === 0 && (
              <p className="text-muted-foreground">Nova will greet you in a moment. Ask about websites, marketing, analytics or a free quote.</p>
            )}
            {lines.map((l, i) => (
              <p key={i} className={l.who === "you" ? "ml-8 rounded-2xl bg-primary px-3 py-2 text-primary-foreground" : "mr-4"}>{l.text}</p>
            ))}
            {voice.error && <p role="alert" className="text-destructive">{voice.error}</p>}
          </div>
          <div className="flex gap-2 border-t border-border p-3">
            {voice.playbackBlocked && <button onClick={voice.resumePlayback} className="btn-primary flex-1 justify-center !py-2 text-sm">Play voice</button>}
            {idle ? (
              <button onClick={launch} className="btn-primary flex-1 justify-center !py-2 text-sm">Start again</button>
            ) : (
              <>
                <button disabled={voice.status !== "connected"} onClick={() => voice.setMuted(!voice.muted)} className="btn-ghost flex-1 justify-center !py-2 text-sm">
                  {voice.muted ? "Unmute" : "Mute"}
                </button>
                <button onClick={voice.stop} disabled={voice.status === "stopping"} className="btn-ghost flex-1 justify-center !py-2 text-sm">End call</button>
              </>
            )}
          </div>
        </div>
      )}
      <button onClick={open ? close : launch} aria-label="Talk to our AI assistant"
        className="ai-fab fixed bottom-5 right-5 z-[60] flex items-center gap-2 rounded-full bg-primary px-5 py-4 font-semibold text-primary-foreground">
        <span className="text-lg">🎙️</span>{open ? "Close" : "Talk to AI"}
      </button>
    </>
  );
}
