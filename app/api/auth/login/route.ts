import { NextResponse } from "next/server";
import { prisma } from "@/config/prisma";
import bcrypt from "bcryptjs";
import { signToken } from "@/config/jwt";

type LoginRequest = {
  username?: string;
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

export async function POST(request: Request) {
  try {
    const body: LoginRequest = await request.json();
    // Di-trim untuk menghilangkan spasi tidak sengaja di awal/akhir input username.
    const username = body.username?.trim().toLowerCase();
    const password = body.password;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "Username dan password wajib diisi." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { username: username },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: `Username "${username}" tidak ditemukan.` },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Password salah." },
        { status: 401 }
      );
    }

    const userPayload = {
      email: user.email,
      username: user.username,
      name: user.name,
      role: user.role,
    };

    const token = await signToken({
      sub: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      user: user,
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


