import { NextResponse, type NextRequest } from "next/server";
export function middleware(request: NextRequest) { const response = NextResponse.next(); if (request.method !== "GET" && request.method !== "HEAD" && request.method !== "OPTIONS") { const origin = request.headers.get("origin"); if (origin && origin !== request.nextUrl.origin) return NextResponse.json({ error: "Cross-origin request rejected." }, { status: 403 }); } return response; }
export const config = { matcher: "/api/:path*" };
