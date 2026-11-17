import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { jsonError } from "@/lib/http";

export async function GET() {
  if (!await requireRole("ADMIN")) return jsonError("Administrator access required.", 403);
  return Response.json({ events: await db.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 200 }) });
}
