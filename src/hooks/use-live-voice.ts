import { useCallback, useEffect, useRef, useState } from "react";

export type LiveEvent = {
  type: string;
  reason?: string;
  error?: { message?: string };
  usage?: { seconds?: number };
  finalized?: boolean;
  transport?: { type?: string; sdp?: string };
  [key: string]: unknown;
};

type LiveState = {
  status: "idle" | "connecting" | "connected" | "stopping" | "closed";
  error: string | null;
  hasConnected: boolean;
  finalized: boolean | null;
  muted: boolean;
  playbackBlocked: boolean;
};

const initialState: LiveState = {
  status: "idle",
  error: null,
  hasConnected: false,
  finalized: null,
  muted: false,
  playbackBlocked: false,
};

export function useLiveVoice(
  options: {
    url?: string;
    greeting?: string;
    history?: () => Turn[];
    onEvent?: (event: LiveEvent) => void | Promise<void>;
  } = {},
) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const controller = useRef<ReturnType<typeof createLiveVoice> | null>(null);
  const mounted = useRef(false);
  const latest = useRef(options);
  const [call, setCall] = useState(initialState);

  useEffect(() => {
    latest.current = options;
  });
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      const voice = controller.current;
      controller.current = null;
      voice?.stop();
    };
  }, []);

  const start = useCallback(() => {
    if (!mounted.current || controller.current) return;
    let endpoint: URL;
    try {
      endpoint = new URL(latest.current.url ?? "/api/chat", window.location.href);
    } catch {
      setCall((previous) => ({ ...previous, error: "Invalid voice connection URL." }));
      return;
    }
    const voice = createLiveVoice({
      url: endpoint.href,
      greeting: latest.current.greeting,
      history: () => latest.current.history?.() ?? [],
      onEvent(event) {
        if (!mounted.current || controller.current !== voice) return;
        if (event.type === "app.connected") {
          setCall((previous) => ({ ...previous, status: "connected", hasConnected: true }));
        } else if (event.type === "app.stopping") {
          setCall((previous) => ({ ...previous, status: "stopping", playbackBlocked: false }));
        } else if (event.type === "app.closed") {
          controller.current = null;
          setCall((previous) => ({
            ...previous,
            status: "closed",
            muted: false,
            playbackBlocked: false,
            finalized: event.finalized === true,
          }));
        } else if (event.type === "app.playback.blocked" || event.type === "app.playback.resumed") {
          setCall((previous) => ({ ...previous, playbackBlocked: event.type === "app.playback.blocked" }));
        } else if (["app.error", "gateway.error", "error"].includes(event.type)) {
          setCall((previous) => ({ ...previous, error: event.error?.message ?? "Voice request failed." }));
        }
        try {
          void Promise.resolve(latest.current.onEvent?.(event)).catch((error) => {
            console.error("Live UI event handler failed", error);
          });
        } catch (error) {
          console.error("Live UI event handler failed", error);
        }
      },
    });
    controller.current = voice;
    setCall({ ...initialState, status: "connecting" });
    void voice.start();
  }, []);

  const stop = useCallback(() => {
    controller.current?.stop();
  }, []);
  const setMuted = useCallback((muted: boolean) => {
    if (controller.current?.setMuted(muted)) setCall((previous) => ({ ...previous, muted }));
  }, []);
  const resumePlayback = useCallback(() => {
    void controller.current?.resumePlayback();
  }, []);

  return { ...call, audioRef, start, stop, setMuted, resumePlayback };
}

type Turn = { role: "user" | "assistant"; content: string };

type LiveOptions = {
  url: string;
  greeting?: string | undefined;
  history?: () => Turn[];
  onEvent: (event: LiveEvent) => void;
};

type Recognition = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  abort(): void;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }> }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
};

function speechRecognition(): (new () => Recognition) | undefined {
  const w = window as unknown as Record<string, (new () => Recognition) | undefined>;
  return w["SpeechRecognition"] ?? w["webkitSpeechRecognition"];
}

// Spoken replies should not read Markdown symbols or links aloud.
function speakable(text: string) {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_`#>~|]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Turn-based voice using the browser's speech recognition and synthesis; replies come from the chat API.
function createLiveVoice(options: LiveOptions) {
  let state: "idle" | "starting" | "active" | "stopping" | "closed" = "idle";
  let recognition: Recognition | undefined;
  let listening = false;
  let busy = false;
  let muted = false;
  let reply: AbortController | undefined;
  let history: Turn[] = [];

  function live() {
    return state === "starting" || state === "active";
  }

  function release() {
    if (state === "closed") return;
    state = "closed";
    window.removeEventListener("pagehide", stop);
    reply?.abort();
    if (recognition) {
      recognition.onend = null;
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.abort();
    }
    window.speechSynthesis?.cancel();
    options.onEvent({ type: "app.closed", finalized: true });
  }

  function stop() {
    if (state === "stopping" || state === "closed") return;
    state = "stopping";
    options.onEvent({ type: "app.stopping" });
    release();
  }

  function fail(message: string) {
    if (!live()) return;
    options.onEvent({ type: "app.error", error: { message } });
    stop();
  }

  function listen() {
    if (state !== "active" || busy || muted || listening || !recognition) return;
    try {
      recognition.start();
      listening = true;
    } catch {
      // start() throws if recognition is already running; onend will resume listening.
    }
  }

  function speak(text: string) {
    return new Promise<void>((resolve) => {
      const synth = window.speechSynthesis;
      const spoken = speakable(text);
      if (!synth || !spoken || !live()) return resolve();
      const utterance = new SpeechSynthesisUtterance(spoken);
      utterance.lang = recognition?.lang ?? navigator.language;
      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();
      synth.cancel();
      synth.speak(utterance);
    });
  }

  async function answer(content: string) {
    busy = true;
    history = [...history, { role: "user" as const, content }].slice(-30);
    options.onEvent({ type: "session.input_transcript.delta", delta: content });
    reply = new AbortController();
    let text = "";
    try {
      const res = await fetch(options.url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
        signal: reply.signal,
      });
      if (!res.ok || !res.body) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error || "Nova could not answer right now.");
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        const delta = decoder.decode(value, { stream: true });
        if (!delta || !live()) continue;
        text += delta;
        options.onEvent({ type: "session.output_transcript.delta", delta });
      }
      if (!text.trim()) throw new Error("Nova could not answer right now.");
      history = [...history, { role: "assistant" as const, content: text }];
      await speak(text);
    } catch (error) {
      if (live()) fail(error instanceof Error ? error.message : "Nova could not answer right now.");
      return;
    } finally {
      busy = false;
      reply = undefined;
    }
    listen();
  }

  function setMuted(value: boolean) {
    if (!live()) return false;
    muted = value;
    if (muted && listening) recognition?.abort();
    else listen();
    return true;
  }

  async function resumePlayback() {
    window.speechSynthesis?.resume();
    if (live()) options.onEvent({ type: "app.playback.resumed" });
  }

  async function start() {
    if (state !== "idle") return;
    state = "starting";
    window.addEventListener("pagehide", stop);
    const Recognition = speechRecognition();
    if (!Recognition || !window.speechSynthesis) {
      return fail("Voice chat isn't supported in this browser. You can still type below.");
    }
    try {
      // Ask for the microphone up front so a denied permission is reported clearly.
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
    } catch {
      return fail("Microphone access was blocked. Allow it to talk with Nova, or type below.");
    }
    if (!live()) return;
    history = (options.history?.() ?? []).slice(-30);
    recognition = new Recognition();
    recognition.lang = navigator.language || "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .filter((result) => result.isFinal)
        .map((result) => result[0]?.transcript ?? "")
        .join(" ")
        .trim();
      if (transcript && !busy && state === "active") void answer(transcript);
    };
    recognition.onerror = (event) => {
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        fail("Microphone access was blocked. Allow it to talk with Nova, or type below.");
      } else if (event.error === "network") {
        fail("Voice recognition lost its connection. Start a new call to retry.");
      }
      // "no-speech" and "aborted" simply end this turn; onend resumes listening.
    };
    recognition.onend = () => {
      listening = false;
      listen();
    };
    state = "active";
    options.onEvent({ type: "app.connected" });
    if (options.greeting) await speak(options.greeting);
    listen();
  }

  return { start, stop, setMuted, resumePlayback };
}
