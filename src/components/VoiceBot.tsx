import { useCallback, useEffect, useRef, useState } from "react";
import { useLiveVoice, type LiveEvent } from "@/hooks/use-live-voice";
import { CONTACT_EMAIL, CUSTOMER_CHAT_EVENT, createEnquiryDraft, enquiryEmailLink } from "@/lib/customer-contact";
import logo from "@/assets/techstone-logo.png";
import ReactMarkdown from "react-markdown";
import { Mic, MicOff, Send, Square, X, Volume2, MessageSquare, Mail, ArrowLeft, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

type Msg = { role: "user" | "assistant"; content: string };

const GREETING: Msg = {
  role: "assistant",
  content: "Welcome to Techstone! I’m Nova, your AI assistant. How can I help you today?",
};
const QUICK = ["I need a website", "How can you get me more customers?", "What is data analytics?"];

export function VoiceBot() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<{ subject: string; body: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const requestRef = useRef<AbortController | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Voice transcripts flow into the same conversation.
  const onEvent = useCallback((e: LiveEvent) => {
    if (e.type === "app.greeting.error") setError(e.error?.message ?? "The voice welcome could not start. You can still type below.");
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
  const msgsRef = useRef(msgs);
  msgsRef.current = msgs;
  const voice = useLiveVoice({
    onEvent,
    greeting: GREETING.content,
    history: () => msgsRef.current.filter((m) => m !== GREETING && m.content.trim()),
  });
  const voiceIdle = voice.status === "idle" || voice.status === "closed";

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }); }, [msgs, busy]);
  useEffect(() => { if (open && !draft) inputRef.current?.focus(); }, [open, draft]);
  useEffect(() => () => requestRef.current?.abort(), []);

  function closeAssistant() {
    voice.stop();
    requestRef.current?.abort();
    setOpen(false);
  }

  function prepareEnquiry() {
    voice.stop();
    setDraft(createEnquiryDraft(msgs));
  }

  async function copyReply() {
    const reply = msgs.filter((message) => message.role === "assistant" && message.content.trim()).at(-1);
    if (!reply) return;
    try {
      await navigator.clipboard.writeText(reply.content);
      setCopied(true);
    } catch {
      setError("Copy is unavailable. Select the reply to copy it.");
    }
  }

  async function send(text: string) {
    const content = text.trim();
    if (!content || busy) return;
    // Typed replies and live speech must not compete for the same conversation.
    if (!voiceIdle) voice.stop();
    setError(null);
    const history = [...msgs.filter((m) => m !== GREETING), { role: "user" as const, content }];
    setMsgs((p) => [...p, { role: "user", content }, { role: "assistant", content: "" }]);
    setInput("");
    setBusy(true);
    setCopied(false);
    const controller = new AbortController();
    requestRef.current = controller;
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history.slice(-30) }),
        signal: controller.signal,
      });
      if (!res.ok || !res.body) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || j.message || "The assistant is unavailable right now.");
      }
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let received = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = dec.decode(value, { stream: true });
        received += chunk;
        setMsgs((p) => [...p.slice(0, -1), { role: "assistant", content: (p[p.length - 1]?.content ?? "") + chunk }]);
      }
      if (!received.trim()) throw new Error("The assistant is unavailable right now.");
    } catch (e) {
      setMsgs((p) => (p[p.length - 1]?.content === "" ? p.slice(0, -1) : p));
      if (!controller.signal.aborted) setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      if (requestRef.current === controller) requestRef.current = null;
      setBusy(false);
    }
  }

  const voiceLabel =
    voice.status === "connecting" ? "Connecting voice…" :
    voice.status === "connected" ? (voice.muted ? "Microphone muted" : "Voice conversation active") :
    voice.status === "stopping" ? "Ending voice…" : voice.error ? "Voice unavailable" : busy ? "Nova is thinking…" : "Techstone · AI assistant";

  function toggleAssistant() {
    if (open) {
      closeAssistant();
      return;
    }
    setOpen(true);
    voice.start();
  }

  useEffect(() => {
    const openChat = () => { setOpen(true); setDraft(null); };
    window.addEventListener(CUSTOMER_CHAT_EVENT, openChat);
    return () => window.removeEventListener(CUSTOMER_CHAT_EVENT, openChat);
  }, []);

  return (
    <>
      <audio ref={voice.audioRef} className="hidden" />
      {open && (
        <div role="dialog" aria-label="Nova assistant" className="chat-panel fixed bottom-24 right-5 z-[60] flex h-[min(620px,calc(100dvh-8rem))] w-[min(440px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-lg border border-border bg-card shadow-2xl">
          <div className="flex items-center gap-3 border-b border-border bg-secondary/60 p-4">
            <div className="relative">
              <img src={logo} alt="" width={40} height={40} className="h-10 w-10" />
            </div>
            <div className="flex-1">
              <p className="font-display font-semibold">Nova</p>
              <p role="status" className="text-xs text-muted-foreground">{voiceLabel}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={closeAssistant} aria-label="Close assistant" title="Close assistant"><X /></Button>
          </div>

          {!draft && <div className="flex items-center gap-2 border-b border-border px-4 py-2">
            <Button variant={voiceIdle ? "secondary" : "ghost"} size="sm" disabled={voice.status === "stopping"} onClick={() => voice.stop()}><MessageSquare />Chat</Button>
            <Button variant={!voiceIdle ? "secondary" : "ghost"} size="sm" disabled={busy || voice.status === "stopping"} onClick={() => { setError(null); if (voiceIdle) voice.start(); }}><Mic />Voice</Button>
            <Button variant="ghost" size="icon" disabled={busy} className="ml-auto" onClick={prepareEnquiry} aria-label="Draft client email" title="Draft client email"><Mail /></Button>
          </div>}

          {!draft && !voiceIdle && <div className="flex items-center gap-3 border-b border-border bg-secondary/30 px-4 py-3">
            {voice.status === "connected" && !voice.muted ? (
              <span className="voice-wave" aria-hidden="true"><i /><i /><i /><i /><i /></span>
            ) : (
              <MicOff className="h-4 w-4 shrink-0 text-muted-foreground" />
            )}
            <p className="flex-1 text-xs text-muted-foreground">{voice.status === "connecting" ? "Connecting…" : voice.muted ? "Muted" : "Voice connected"}</p>
            {voice.status === "connected" && <Button variant="ghost" size="icon" aria-label={voice.muted ? "Unmute microphone" : "Mute microphone"} title={voice.muted ? "Unmute microphone" : "Mute microphone"} onClick={() => voice.setMuted(!voice.muted)}>{voice.muted ? <MicOff /> : <Mic />}</Button>}
          </div>}

          {draft ? <div className="flex-1 overflow-y-auto p-4">
            <Button variant="ghost" size="sm" className="mb-4" onClick={() => setDraft(null)}><ArrowLeft />Back to conversation</Button>
            <h2 className="font-display text-lg font-semibold">Client enquiry</h2>
            <p className="mb-4 mt-1 break-all text-xs text-muted-foreground">To: {CONTACT_EMAIL}</p>
            <label className="block text-xs font-semibold" htmlFor="enquiry-subject">Subject</label>
            <input id="enquiry-subject" value={draft.subject} onChange={(event) => setDraft({ ...draft, subject: event.target.value })} className="mb-4 mt-2 w-full rounded-md border border-input bg-secondary px-3 py-2 text-sm" />
            <label className="block text-xs font-semibold" htmlFor="enquiry-body">Message</label>
            <textarea id="enquiry-body" value={draft.body} onChange={(event) => setDraft({ ...draft, body: event.target.value })} rows={8} className="mt-2 w-full resize-y rounded-md border border-input bg-secondary px-3 py-2 text-sm" />
            <p className="mt-3 text-xs text-muted-foreground">Draft only — not sent. Review and send from your email app.</p>
            <Button asChild className="mt-4 w-full"><a href={enquiryEmailLink(draft.subject, draft.body)}><Mail />Open email draft</a></Button>
          </div> : <>

          <div className="flex-1 space-y-3 overflow-y-auto p-4 text-sm">
            {msgs.map((m, i) => (
              <div key={i} className={m.role === "user" ? "flex justify-end" : "flex"}>
                {m.role === "user" ? (
                  <p className="message-in max-w-[85%] break-words whitespace-pre-wrap rounded-lg bg-secondary px-3.5 py-2 text-secondary-foreground">{m.content}</p>
                ) : (
                   <div className="chat-md message-in min-w-0 max-w-full break-words leading-relaxed">
                    {m.content ? <ReactMarkdown>{m.content}</ReactMarkdown> : <span className="typing"><i /><i /><i /></span>}
                  </div>
                )}
              </div>
            ))}
            {msgs.length === 1 && (
              <div className="space-y-3 pt-1">
                {voiceIdle && (
                  <Button onClick={() => voice.start()} disabled={busy} variant="outline" className="w-full">
                    <Mic />Talk with Nova live
                  </Button>
                )}
                <div className="flex flex-wrap gap-2">
                  {QUICK.map((q) => (
                   <Button variant="outline" size="sm" key={q} disabled={busy} onClick={() => send(q)} className="h-auto whitespace-normal text-left">{q}</Button>
                  ))}
                </div>
              </div>
            )}
            {(error || voice.error) && <p role="alert" className="text-destructive">{error || voice.error}</p>}
            <div ref={endRef} />
          </div>

          {msgs.length > 1 && !busy && <div className="flex items-center gap-1 px-3 pb-2">
            <Button variant="ghost" size="icon" onClick={copyReply} aria-label={copied ? "Reply copied" : "Copy latest reply"} title={copied ? "Copied" : "Copy latest reply"}>{copied ? <Check /> : <Copy />}</Button>
            <Button variant="ghost" size="sm" onClick={prepareEnquiry}><Mail />Draft enquiry</Button>
          </div>}

          {voice.playbackBlocked && (
            <Button onClick={voice.resumePlayback} className="mx-3 mb-2"><Volume2 />Play voice</Button>
          )}
          <a href={`mailto:${CONTACT_EMAIL}`} className="border-t border-border px-4 py-2 text-xs text-accent hover:underline">Email the Techstone team ↗</a>
          <form className="flex items-center gap-2 border-t border-border p-3" onSubmit={(e) => { e.preventDefault(); send(input); }}>
            <Button variant={voiceIdle ? "outline" : "destructive"} size="icon" type="button" aria-label={voiceIdle ? "Start voice chat" : "End voice chat"} title={voiceIdle ? "Start voice chat" : "End voice chat"}
              onClick={() => (voiceIdle ? voice.start() : voice.stop())}
               disabled={busy || voice.status === "stopping"}
              className="h-10 w-10 shrink-0">
              {voiceIdle ? <Mic /> : <Square />}
            </Button>
            <input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask Nova anything…"
              aria-label="Message Nova" className="h-10 min-w-0 flex-1 rounded-md border border-input bg-secondary px-3 outline-none focus:border-primary" />
            {busy ? <Button type="button" variant="outline" size="icon" onClick={() => requestRef.current?.abort()} aria-label="Stop reply" title="Stop reply" className="h-10 w-10 shrink-0"><Square /></Button> : <Button type="submit" size="icon" disabled={!input.trim()} aria-label="Send" title="Send message" className="h-10 w-10 shrink-0"><Send /></Button>}
          </form>
          </>}
        </div>
      )}
      <Button onClick={toggleAssistant} aria-label="Chat with our AI assistant" title="Open Nova — microphone access starts voice conversation" aria-expanded={open}
        className="ai-fab fixed bottom-5 right-5 z-[60] flex items-center gap-2 rounded-full bg-primary py-2.5 pl-2.5 pr-5 font-semibold text-primary-foreground">
        <img src={logo} alt="" width={36} height={36} className="h-9 w-9 rounded-full bg-background p-1" />
        {open ? "Close" : "Ask AI"}
      </Button>
    </>
  );
}
