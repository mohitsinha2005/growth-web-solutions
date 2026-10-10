import { useCallback, useEffect, useRef, useState } from "react";
import { useLiveVoice, type LiveEvent } from "@/hooks/use-live-voice";
import logo from "@/assets/logo.png";
import ReactMarkdown from "react-markdown";

type Msg = { role: "user" | "assistant"; content: string };

const GREETING: Msg = {
  role: "assistant",
  content: "Hi, I'm Nova from Brightlane Digital 👋 How can I help grow your business today? Type below or tap the mic to talk.",
};
const QUICK = ["I need a website", "How can you get me more customers?", "What is data analytics?"];

export function VoiceBot() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Voice transcripts flow into the same conversation.
  const onEvent = useCallback((e: LiveEvent) => {
    const t = e.type as string;
    const delta = (e as { delta?: string }).delta;
    if (!delta) return;
    const role = t === "session.input_transcript.delta" ? "user" : t === "session.output_transcript.delta" ? "assistant" : null;
    if (!role) return;
    setMsgs((prev) => {
      const last = prev[prev.length - 1];
      if (last && last.role === role && last !== GREETING) return [...prev.slice(0, -1), { role, content: last.content + delta }];
      return [...prev, { role, content: delta }];
    });
  }, []);
  const voice = useLiveVoice({ onEvent });
  const voiceIdle = voice.status === "idle" || voice.status === "closed";

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, busy]);
  useEffect(() => { if (open) inputRef.current?.focus(); }, [open, busy]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || busy) return;
    setError(null);
    const history = [...msgs.filter((m) => m !== GREETING), { role: "user" as const, content }];
    setMsgs((p) => [...p, { role: "user", content }, { role: "assistant", content: "" }]);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history.slice(-30) }),
      });
      if (!res.ok || !res.body) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || j.message || "The assistant is unavailable right now.");
      }
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = dec.decode(value, { stream: true });
        setMsgs((p) => [...p.slice(0, -1), { role: "assistant", content: (p[p.length - 1]?.content ?? "") + chunk }]);
      }
    } catch (e) {
      setMsgs((p) => (p[p.length - 1]?.content === "" ? p.slice(0, -1) : p));
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  const voiceLabel =
    voice.status === "connecting" ? "Connecting voice…" :
    voice.status === "connected" ? (voice.muted ? "Voice muted" : "Listening — just speak") :
    voice.status === "stopping" ? "Ending voice…" : "Online · replies instantly";

  return (
    <>
      <audio ref={voice.audioRef} className="hidden" />
      {open && (
        <div className="chat-panel fixed bottom-24 right-5 z-[60] flex h-[min(560px,calc(100vh-8rem))] w-[min(380px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-3xl border border-border bg-card/95 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-3 border-b border-border bg-secondary/60 p-4">
            <div className={`relative ${voice.status === "connected" ? "orb-live rounded-xl" : ""}`}>
              <img src={logo} alt="" width={40} height={40} className="h-10 w-10" />
            </div>
            <div className="flex-1">
              <p className="font-display font-semibold">Nova · AI Assistant</p>
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><span className="h-2 w-2 rounded-full bg-accent" />{voiceLabel}</p>
            </div>
            <button onClick={() => { voice.stop(); setOpen(false); }} aria-label="Close assistant" className="text-muted-foreground hover:text-foreground">✕</button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4 text-sm">
            {msgs.map((m, i) => (
              <div key={i} className={m.role === "user" ? "flex justify-end" : "flex"}>
                {m.role === "user" ? (
                  <p className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-sm bg-primary px-3.5 py-2 text-primary-foreground">{m.content}</p>
                ) : (
                  <div className="chat-md max-w-[92%] leading-relaxed">
                    {m.content ? <ReactMarkdown>{m.content}</ReactMarkdown> : <span className="typing"><i /><i /><i /></span>}
                  </div>
                )}
              </div>
            ))}
            {msgs.length === 1 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {QUICK.map((q) => (
                  <button key={q} onClick={() => send(q)} className="rounded-full border border-border px-3 py-1.5 text-xs hover:border-primary hover:text-primary">{q}</button>
                ))}
              </div>
            )}
            {(error || voice.error) && <p role="alert" className="text-destructive">{error || voice.error}</p>}
            <div ref={endRef} />
          </div>

          {voice.playbackBlocked && (
            <button onClick={voice.resumePlayback} className="btn-primary mx-3 mb-2 justify-center !py-2 text-sm">Play voice</button>
          )}
          <form className="flex items-center gap-2 border-t border-border p-3" onSubmit={(e) => { e.preventDefault(); send(input); }}>
            <button type="button" aria-label={voiceIdle ? "Start voice chat" : "End voice chat"}
              onClick={() => (voiceIdle ? voice.start() : voice.stop())}
              disabled={voice.status === "stopping"}
              className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border ${voiceIdle ? "hover:border-primary" : "mic-live"}`}>
              {voiceIdle ? "🎙️" : "■"}
            </button>
            <input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask Nova anything…"
              className="h-10 flex-1 rounded-full border border-input bg-secondary px-4 outline-none focus:border-primary" />
            <button disabled={busy || !input.trim()} aria-label="Send" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground disabled:opacity-40">➤</button>
          </form>
        </div>
      )}
      <button onClick={() => setOpen(!open)} aria-label="Chat with our AI assistant"
        className="ai-fab fixed bottom-5 right-5 z-[60] flex items-center gap-2 rounded-full bg-primary py-2.5 pl-2.5 pr-5 font-semibold text-primary-foreground">
        <img src={logo} alt="" width={36} height={36} className="h-9 w-9 rounded-full bg-background p-1" />
        {open ? "Close" : "Ask AI"}
      </button>
    </>
  );
}
