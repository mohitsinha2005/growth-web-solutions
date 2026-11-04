export const COMPANY_NAME = "Bitfarm";
export const CONTACT_EMAIL = "bitfarm.help@gmail.com";
export const CUSTOMER_CHAT_EVENT = "bitfarm:open-customer-chat";

export function createEnquiryDraft(turns: { role: "user" | "assistant"; content: string }[]) {
  const requests = turns.filter((turn) => turn.role === "user" && turn.content.trim());
  return {
    subject: `${COMPANY_NAME} client enquiry`,
    body: `Hello ${COMPANY_NAME} team,\n\n${requests.length ? requests.map((turn) => turn.content.trim()).join("\n\n") : "I would like to discuss a project with your team."}\n\nName: \nCompany: \nContact email: \n\nThank you.`,
  };
}

export function enquiryEmailLink(subject: string, body: string) {
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function openCustomerChat() {
  window.dispatchEvent(new Event(CUSTOMER_CHAT_EVENT));
}