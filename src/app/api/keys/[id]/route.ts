import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { jsonError } from "@/lib/http";

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const user = await currentUser();
  if (!user) return jsonError("Authentication required.", 401);
  const { id } = await context.params;
  const result = await db.apiKey.updateMany({ where: { id, userId: user.id, revokedAt: null }, data: { revokedAt: new Date() } });
  if (!result.count) return jsonError("API key not found or already revoked.", 404);
  await db.auditLog.create({ data: { actorId: user.id, action: "api_key.revoked", entityType: "ApiKey", entityId: id } });
  return Response.json({ ok: true });
}
