import { NextResponse } from "next/server";
export async function GET() { return NextResponse.json({ ok: true, service: "vox-smm", integrations: { payments: "disabled", campaignProvider: "disabled" } }); }
