import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/jwt";

type LoginRequest = {
  email?: string;
  password?: string;
};

const COOKIE_MAX_AGE = 60 * 60 * 24; // 1 day

const buildCookieOptions = () => ({
  httpOnly: false,
  sameSite: "lax" as const,
  path: "/",
  secure: process.env.NODE_ENV === "production",
  maxAge: COOKIE_MAX_AGE,
});

const normalizeIdentifier = (identifier: string) => {
  const trimmed = identifier.trim();
  if (!trimmed.includes("@")) {
    if (trimmed.toLowerCase() === "admin") {
      return "admin@daytonfintech.com";
    }
  }
  return trimmed.toLowerCase();
};

export async function POST(request: Request) {
  try {
    const body: LoginRequest = await request.json();
    const email = body.email?.trim();
    const password = body.password;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email dan password wajib diisi." },
        { status: 400 }
      );
    }

    const normalizedEmail = normalizeIdentifier(email);
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Email atau password salah." },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Email atau password salah." },
        { status: 401 }
      );
    }

    const userPayload = {
      email: user.email,
      name: user.name ?? "Admin",
      role: user.role,
    };

    const token = await signToken({
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      user: userPayload,
      token,
    });

    const cookieOptions = buildCookieOptions();

    response.cookies.set(
      "auth_user",
      encodeURIComponent(JSON.stringify(userPayload)),
      cookieOptions
    );
    response.cookies.set("auth_token", token, cookieOptions);

    return response;
  } catch (error) {
    console.error("[API] Login error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan saat login." },
      { status: 500 }
    );
  }
}


