import { currentUser } from "@/lib/auth";
import { jsonError } from "@/lib/http";

export async function GET() {
  const user = await currentUser();
  if (!user) return jsonError("Authentication required.", 401);
  return Response.json({ user });
}
