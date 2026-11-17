import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ status: "ok", service: "launchpad-smm" }, {
    headers: { "Cache-Control": "no-store" }
  });
}
