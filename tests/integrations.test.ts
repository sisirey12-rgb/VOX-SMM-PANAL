import { describe, expect, it } from "vitest";
import { paymentGateway, campaignProvider } from "../src/lib/integrations";
describe("safe integration defaults", () => { it("does not fake successful payment setup", () => expect(() => paymentGateway()).toThrow(/disabled/)); it("does not fake provider submission", () => expect(() => campaignProvider()).toThrow(/not configured/)); });
