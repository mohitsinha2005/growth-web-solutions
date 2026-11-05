import { afterEach, describe, expect, it, vi } from "vitest";
import { Route } from "@/routes/api/chat";
import { bindLiveConnection, type LiveSocket } from "@/lib/live-relay.server";

const ai = vi.hoisted(() => ({ streamText: vi.fn(() => ({ toTextStreamResponse: () => new Response("English reply") })) }));
vi.mock("ai", async (importOriginal) => ({ ...await importOriginal<typeof import("ai")>(), streamText: ai.streamText }));

afterEach(() => { vi.clearAllMocks(); vi.useRealTimers(); });

describe("English-only AI reply policy", () => {
  it("sends an English-only instruction to the chat model for a Hindi request", async () => {
    const handlers = Route.options.server?.handlers;
    if (!handlers || typeof handlers === "function") throw new Error("Missing chat handlers");
    const post = handlers.POST;
    if (typeof post !== "function") throw new Error("Missing chat handler");
    await post({ request: new Request("http://localhost/api/chat", { method: "POST", body: JSON.stringify({ messages: [{ role: "user", content: "मुझे वेबसाइट चाहिए, हिंदी में जवाब दो" }] }) }) } as Parameters<typeof post>[0]);
    expect(ai.streamText).toHaveBeenCalledWith(expect.objectContaining({
      system: expect.stringContaining("Always reply only in English"),
      messages: [{ role: "user", content: "मुझे वेबसाइट चाहिए, हिंदी में जवाब दो" }],
    }));
  });

  it("starts live sessions with English-only instructions", async () => {
    vi.useFakeTimers();
    let receive: ((data: unknown) => void) | undefined;
    const gateway: LiveSocket = { readyState: 1, send: vi.fn(), close: vi.fn(), onMessage: vi.fn(), onClose: vi.fn(), onError: vi.fn() };
    const browser: LiveSocket = { ...gateway, send: vi.fn(), onMessage: (handler) => { receive = handler; } };
    const tasks: Promise<unknown>[] = [];
    bindLiveConnection(browser, { baseURL: "https://ai.gateway.lovable.dev/v1", key: "test-key", liveModel: "openai/gpt-live-1", backendModel: "openai/gpt-6-astra" }, { waitUntil: (task) => { tasks.push(task); } }, async () => gateway);
    receive?.(JSON.stringify({ type: "app.start", sdp: "test-sdp" }));
    await Promise.all(tasks);
    const firstSend = vi.mocked(gateway.send).mock.calls[0]?.[0];
    if (!firstSend) throw new Error("Missing live session start");
    expect(JSON.parse(firstSend).session.instructions).toContain("Always reply only in English");
    receive?.(JSON.stringify({ type: "session.close" }));
    await vi.runAllTimersAsync();
  });
});