import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
const key = () => { const secret = process.env.SESSION_SECRET; if (!secret || secret.length < 32) throw new Error("SESSION_SECRET must be at least 32 characters"); return new TextEncoder().encode(secret); };
export async function createSession(userId: string) { const token = await new SignJWT({ sub: userId }).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("7d").sign(key()); (await cookies()).set("vox_session", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7 }); }
export async function currentUser() { const token = (await cookies()).get("vox_session")?.value; if (!token) return null; try { const { payload } = await jwtVerify(token, key()); if (!payload.sub) return null; return await db.user.findFirst({ where: { id: payload.sub, disabledAt: null }, select: { id: true, name: true, email: true, role: true } }); } catch { return null; } }
export async function requireRole(role: "CUSTOMER" | "ADMIN") { const user = await currentUser(); if (!user || (role === "ADMIN" && user.role !== "ADMIN")) return null; return user; }
