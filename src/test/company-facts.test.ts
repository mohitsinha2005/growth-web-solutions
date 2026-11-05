import { describe, expect, it } from "vitest";
import { COMPANY_FACTS } from "@/lib/company-facts";

describe("Confirmed Bitfarm company figures", () => {
  it("has 112+ delivered projects", () => { expect(COMPANY_FACTS.projectsDelivered).toBe(112); });
  it("has served 21 countries", () => { expect(COMPANY_FACTS.countriesServed).toBe(21); });
  it("responds in four hours maximum", () => { expect(COMPANY_FACTS.maximumResponseHours).toBe(4); });
});