export const COMPANY_NAME = "Techstone";
export const CONTACT_EMAIL = "techstone.in@gmail.com";
export const CUSTOMER_CHAT_EVENT = "techstone:open-customer-chat";

export function openCustomerChat() {
  window.dispatchEvent(new Event(CUSTOMER_CHAT_EVENT));
}