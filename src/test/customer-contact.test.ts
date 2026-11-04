import { describe, expect, it, vi } from "vitest";
import { COMPANY_NAME, CONTACT_EMAIL, CUSTOMER_CHAT_EVENT, openCustomerChat, createEnquiryDraft, enquiryEmailLink } from "@/lib/customer-contact";

describe("Customer contact", () => {
  it("addresses editable enquiry drafts to the owner and includes client requests only", () => {
    const draft = createEnquiryDraft([{ role: "user", content: "Build a shop website" }, { role: "assistant", content: "Unverified quote" }]);
    const url = enquiryEmailLink(draft.subject, draft.body);
    expect(url.startsWith("mailto:bitfarm.help@gmail.com?")).toBe(true);
    expect(decodeURIComponent(url)).toContain("Build a shop website");
    expect(draft.body).not.toContain("Unverified quote");
  });
  it("uses the company name chosen by the owner", () => {
    expect(COMPANY_NAME).toBe("Bitfarm");
  });
  it("addresses customer emails to the owner", () => {
    expect(CONTACT_EMAIL).toBe("bitfarm.help@gmail.com");
  });
  it("opens customer chat through the shared assistant", () => {
    const listener = vi.fn();
    window.addEventListener(CUSTOMER_CHAT_EVENT, listener);
    openCustomerChat();
    expect(listener).toHaveBeenCalledTimes(1);
    window.removeEventListener(CUSTOMER_CHAT_EVENT, listener);
  });
});