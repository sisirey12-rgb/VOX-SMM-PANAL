import { z } from "zod";

export const createOrderSchema = z.object({
  serviceId: z.string().min(1).max(64),
  targetUrl: z.string().url().max(2048),
  brief: z.string().min(20).max(3000),
  budgetCents: z.number().int().min(1000).max(10000000)
});

export const registrationSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().email().max(254),
  password: z.string().min(12).max(128).regex(/[A-Z]/).regex(/[a-z]/).regex(/[0-9]/)
});
