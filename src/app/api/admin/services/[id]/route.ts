import { z } from "zod";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { jsonError } from "@/lib/http";

const updateSchema = z.object({ name: z.string().trim().min(3).max(100).optional(), category: z.string().trim().min(2).max(80).optional(), description: z.string().trim().min(10).max(1000).optional(), priceCents: z.number().int().min(0).max(100000000).optional(), active: z.boolean().optional() }).refine(value => Object.keys(value).length > 0);
export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const admin = await requireRole("ADMIN"); if (!admin) return jsonError("Administrator access required.", 403);
  const parsed = updateSchema.safeParse(await request.json().catch(() => null)); if (!parsed.success) return jsonError("Provide valid service updates.");
  const { id } = await context.params;
  const service = await db.service.update({ where: { id }, data: parsed.data }).catch(() => null); if (!service) return jsonError("Service not found.", 404);
  await db.auditLog.create({ data: { actorId: admin.id, action: "service.updated", entityType: "Service", entityId: id, metadata: parsed.data } });
  return Response.json({ service });
}
