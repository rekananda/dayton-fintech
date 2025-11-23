import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/config/jwt";
import { prisma } from "@/config/prisma";

const COOKIE_MAX_AGE = 60 * 60 * 24;

const buildCookieOptions = () => ({
  httpOnly: false,
  sameSite: "lax" as const,
  path: "/",
  secure: process.env.NODE_ENV === "production",
  maxAge: COOKIE_MAX_AGE,
});

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload?.sub) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    let user = await prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      user = await prisma.user.findUnique({
        where: { email: payload.email },
      });
    }

    if (!user) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const userPayload = {
      email: user.email,
      name: user.name ?? "Admin",
      role: user.role,
    };

    const response = NextResponse.json({
      authenticated: true,
      user: userPayload,
    });

    const cookieOptions = buildCookieOptions();
    response.cookies.set(
      "auth_user",
      encodeURIComponent(JSON.stringify(userPayload)),
      cookieOptions
    );

    return response;
  } catch (error) {
    console.error("[API] Session check error:", error);
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}


