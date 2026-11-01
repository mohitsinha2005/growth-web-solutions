import { describe, expect, it, vi } from "vitest";
import { COMPANY_NAME, CONTACT_EMAIL, CUSTOMER_CHAT_EVENT, openCustomerChat } from "@/lib/customer-contact";

describe("Customer contact", () => {
  it("uses the company name chosen by the owner", () => {
    expect(COMPANY_NAME).toBe("Techstone");
  });
  it("addresses customer emails to the owner", () => {
    expect(CONTACT_EMAIL).toBe("techstone.in@gmail.com");
  });
  it("opens customer chat through the shared assistant", () => {
    const listener = vi.fn();
    window.addEventListener(CUSTOMER_CHAT_EVENT, listener);
    openCustomerChat();
    expect(listener).toHaveBeenCalledTimes(1);
    window.removeEventListener(CUSTOMER_CHAT_EVENT, listener);
  });
});