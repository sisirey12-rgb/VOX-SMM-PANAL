import { z } from "zod";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { jsonError } from "@/lib/http";

const schema = z.object({ ticketId: z.string().min(1), status: z.enum(["OPEN", "WAITING", "RESOLVED", "CLOSED"]).optional(), reply: z.string().trim().min(1).max(5000).optional() }).refine(value => value.status !== undefined || value.reply !== undefined);
export async function PATCH(request: Request) {
  const admin = await requireRole("ADMIN"); if (!admin) return jsonError("Administrator access required.", 403);
  const parsed = schema.safeParse(await request.json().catch(() => null)); if (!parsed.success) return jsonError("Provide a ticket update or reply.");
  const { ticketId, status, reply } = parsed.data;
  const ticket = await db.$transaction(async tx => {
    await tx.ticket.update({ where: { id: ticketId }, data: status ? { status } : {} });
    if (reply) await tx.ticketMessage.create({ data: { ticketId, authorId: admin.id, body: reply } });
    return tx.ticket.findUnique({ where: { id: ticketId }, include: { messages: true, user: { select: { id: true, name: true, email: true } } } });
  }).catch(() => null);
  if (!ticket) return jsonError("Ticket not found.", 404);
  await db.auditLog.create({ data: { actorId: admin.id, action: reply ? "ticket.replied" : "ticket.status_changed", entityType: "Ticket", entityId: ticketId, metadata: status ? { status } : undefined } });
  return Response.json({ ticket });
}
