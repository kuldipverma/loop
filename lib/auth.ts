import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export async function getSessionUserId() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;
  return sessionToken || null;
}

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || "loop-secret-key");

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return await bcrypt.compare(password, hash);
}

export async function createSession(userId: string, orgId: string) {
  const token = await new SignJWT({ userId, orgId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(SECRET_KEY);

  const cookieStore = await cookies();
  cookieStore.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
}