import { db } from "@/lib/db";
import { jsonError } from "@/lib/http";
import { currentUser } from "@/lib/auth";

export async function GET() {
  const user = await currentUser();
  if (!user) return jsonError("Authentication required.", 401);
  const services = await db.service.findMany({ where: { active: true }, orderBy: [{ category: "asc" }, { name: "asc" }], select: { id: true, name: true, category: true, description: true, priceCents: true } });
  return Response.json({ services, currency: "USD" });
}
