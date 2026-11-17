import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { createSession } from "@/lib/auth";
import { jsonError, rateLimit } from "@/lib/http";
const schema = z.object({ email: z.string().email().max(254), password: z.string().min(10).max(128) });
export async function POST(request: Request) { if (rateLimit(request, 8)) return jsonError("Too many attempts. Try again shortly.", 429); const parsed = schema.safeParse(await request.json().catch(() => null)); if (!parsed.success) return jsonError("Invalid email or password.", 400); const user = await db.user.findFirst({ where: { email: parsed.data.email.toLowerCase(), disabledAt: null } }); if (!user || !(await bcrypt.compare(parsed.data.password, user.passwordHash))) return jsonError("Invalid email or password.", 401); await createSession(user.id); return Response.json({ user: { id: user.id, name: user.name, role: user.role } }); }
