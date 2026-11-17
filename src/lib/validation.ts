import { z } from "zod";

export const createOrderSchema = z.object({
  serviceId: z.string().min(1).max(64),
  targetUrl: z.url().max(2048),
  quantity: z.number().int().min(1).max(100000)
});

export const registrationSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.email().max(254),
  password: z.string().min(12).max(128)
});
