import { z } from "zod";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { jsonError } from "@/lib/http";

const schema = z.object({ disabled: z.boolean() });
export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const admin = await requireRole("ADMIN"); if (!admin) return jsonError("Administrator access required.", 403);
  const parsed = schema.safeParse(await request.json().catch(() => null)); if (!parsed.success) return jsonError("Provide a valid account status.");
  const { id } = await context.params; if (id === admin.id && parsed.data.disabled) return jsonError("You cannot disable your own account.", 400);
  const user = await db.user.update({ where: { id }, data: { disabledAt: parsed.data.disabled ? new Date() : null }, select: { id: true, email: true, name: true, role: true, disabledAt: true } }).catch(() => null);
  if (!user) return jsonError("User not found.", 404);
  await db.auditLog.create({ data: { actorId: admin.id, action: parsed.data.disabled ? "user.disabled" : "user.enabled", entityType: "User", entityId: id } });
  return Response.json({ user });
}
