import { z } from "zod";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { jsonError } from "@/lib/http";

const statuses = ["DRAFT", "PENDING", "REVIEW", "APPROVED", "RUNNING", "PAUSED", "COMPLETED", "CANCELED", "FAILED"] as const;
const updateSchema = z.object({ orderId: z.string().min(1), status: z.enum(statuses) });

export async function GET() {
  const admin = await requireRole("ADMIN");
  if (!admin) return jsonError("Administrator access required.", 403);
  return Response.json({ orders: await db.order.findMany({ include: { service: true, user: { select: { id: true, name: true, email: true } } }, orderBy: { createdAt: "desc" }, take: 200 }) });
}

export async function PATCH(request: Request) {
  const admin = await requireRole("ADMIN");
  if (!admin) return jsonError("Administrator access required.", 403);
  const parsed = updateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return jsonError("Provide an order ID and valid status.");
  const updated = await db.order.update({ where: { id: parsed.data.orderId }, data: { status: parsed.data.status } }).catch(() => null);
  if (!updated) return jsonError("Order not found.", 404);
  await db.auditLog.create({ data: { actorId: admin.id, action: "order.status_changed", entityType: "Order", entityId: updated.id, metadata: { status: updated.status } } });
  return Response.json({ order: updated });
}
