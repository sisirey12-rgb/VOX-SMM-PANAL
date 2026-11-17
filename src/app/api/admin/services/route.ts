import { z } from "zod";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { jsonError } from "@/lib/http";

const createSchema = z.object({ name: z.string().trim().min(3).max(100), category: z.string().trim().min(2).max(80), description: z.string().trim().min(10).max(1000), priceCents: z.number().int().min(0).max(100000000) });
export async function GET() { if (!await requireRole("ADMIN")) return jsonError("Administrator access required.", 403); return Response.json({ services: await db.service.findMany({ orderBy: [{ active: "desc" }, { category: "asc" }, { name: "asc" }] }) }); }
export async function POST(request: Request) {
  const admin = await requireRole("ADMIN"); if (!admin) return jsonError("Administrator access required.", 403);
  const parsed = createSchema.safeParse(await request.json().catch(() => null)); if (!parsed.success) return jsonError("Provide a valid service name, category, description, and price.");
  const service = await db.service.create({ data: parsed.data });
  await db.auditLog.create({ data: { actorId: admin.id, action: "service.created", entityType: "Service", entityId: service.id } });
  return Response.json({ service }, { status: 201 });
}
