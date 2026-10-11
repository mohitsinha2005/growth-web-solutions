import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { WelcomeScreen } from "@/components/WelcomeScreen";

afterEach(() => { cleanup(); vi.useRealTimers(); });

describe("Three-second website entrance", () => {
  it("keeps the welcome visible until 3000 milliseconds then unlocks the website", () => {
    vi.useFakeTimers();
    render(<WelcomeScreen><main>Website content</main></WelcomeScreen>);
    const site = screen.getByText("Website content").parentElement;
    expect(site?.hasAttribute("inert")).toBe(true);
    act(() => { vi.advanceTimersByTime(2999); });
    expect(screen.getByRole("status")).toBeTruthy();
    act(() => { vi.advanceTimersByTime(1); });
    expect(screen.queryByRole("status")).toBeNull();
    expect(site?.hasAttribute("inert")).toBe(false);
    expect(document.body.style.overflow).not.toBe("hidden");
  });
});