export type PaymentIntent = { id: string; checkoutUrl: string };
export interface PaymentGateway { createCheckout(input: { amountCents: number; currency: string; reference: string }): Promise<PaymentIntent>; verifyWebhook(rawBody: string, signature: string): Promise<{ eventId: string; paid: boolean; reference: string }>; }
export interface CampaignProvider { submitCampaign(input: { orderId: string; objective: string; targetUrl: string }): Promise<{ providerReference: string }>; }
export function paymentGateway(): PaymentGateway { throw new Error("Payment integration is disabled. Configure and implement a verified provider adapter before enabling deposits."); }
export function campaignProvider(): CampaignProvider { throw new Error("Campaign provider is not configured. No campaign was submitted."); }
