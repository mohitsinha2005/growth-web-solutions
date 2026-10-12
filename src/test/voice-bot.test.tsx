import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { VoiceBot } from "@/components/VoiceBot";

const controls = vi.hoisted(() => ({ start: vi.fn(), stop: vi.fn(), setMuted: vi.fn(), resumePlayback: vi.fn(), status: "idle" }));
vi.mock("@/hooks/use-live-voice", () => ({
  useLiveVoice: () => ({ ...controls, error: null, muted: false, playbackBlocked: false, audioRef: { current: null } }),
}));

beforeEach(() => {
  vi.clearAllMocks();
  controls.status = "idle";
  Element.prototype.scrollIntoView = vi.fn();
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

describe("Nova voice opening", () => {
  it("ends active voice before requesting a typed reply", async () => {
    controls.status = "connected";
    const fetchReply = vi.fn(async () => new Response("We can help with your website."));
    vi.stubGlobal("fetch", fetchReply);
    render(<VoiceBot />);
    fireEvent.click(screen.getByRole("button", { name: "Chat with our AI assistant" }));
    fireEvent.change(screen.getByRole("textbox", { name: "Message Nova" }), { target: { value: "I need a website" } });
    fireEvent.click(screen.getByRole("button", { name: "Send", exact: true }));
    expect(controls.stop).toHaveBeenCalledTimes(1);
    expect(controls.stop.mock.invocationCallOrder[0]).toBeLessThan(fetchReply.mock.invocationCallOrder[0]);
    await waitFor(() => expect(screen.getByText("We can help with your website.")).toBeTruthy());
  });
  it("starts voice once when the visitor opens the AI assistant", () => {
    render(<VoiceBot />);
    expect(controls.start).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Chat with our AI assistant" }));
    expect(controls.start).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("dialog", { name: "Nova assistant" })).toBeTruthy();
  });

  it("stops voice when the floating AI button closes the assistant", () => {
    render(<VoiceBot />);
    const toggle = screen.getByRole("button", { name: "Chat with our AI assistant" });
    fireEvent.click(toggle);
    fireEvent.click(toggle);
    expect(controls.stop).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("stops voice when the panel close control is used", () => {
    render(<VoiceBot />);
    fireEvent.click(screen.getByRole("button", { name: "Chat with our AI assistant" }));
    fireEvent.click(screen.getByRole("button", { name: "Close assistant" }));
    expect(controls.stop).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});