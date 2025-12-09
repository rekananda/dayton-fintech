import { NextResponse } from "next/server";
import { prisma } from "@/config/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/config/jwt";

type ProfilePayload = {
  email?: string;
  username?: string;
  name?: string;
};

export async function PUT(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.toLowerCase().startsWith("bearer ")) {
      return NextResponse.json(
        { success: false, message: "Token tidak valid. Silakan login ulang." },
        { status: 401 }
      );
    }
    const headerToken = authHeader.split(" ")[1];
    const tokenPayload = await verifyToken(headerToken);

    if (!tokenPayload?.email || !tokenPayload?.sub) {
      return NextResponse.json(
        { success: false, message: "Token tidak valid. Silakan login ulang." },
        { status: 401 }
      );
    }

    const { email, username, name }: ProfilePayload = await request.json();

    if (!email || !username || !name) {
      return NextResponse.json(
        { success: false, message: "Email, username, dan nama wajib diisi." },
        { status: 400 }
      );
    }

    if (email.trim().length < 3) {
      return NextResponse.json(
        { success: false, message: "Email minimal 3 karakter." },
        { status: 400 }
      );
    }

    if (username.trim().length < 3) {
      return NextResponse.json(
        { success: false, message: "Username minimal 3 karakter." },
        { status: 400 }
      );
    }

    if (name.trim().length < 3) {
      return NextResponse.json(
        { success: false, message: "Nama minimal 3 karakter." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Format email tidak valid." },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const authTokenCookie = cookieStore.get("auth_token");

    if (!authTokenCookie?.value || authTokenCookie.value !== headerToken) {
      return NextResponse.json(
        { success: false, message: "Token tidak valid. Silakan login kembali." },
        { status: 401 }
      );
    }

    let user = await prisma.user.findUnique({
      where: { id: tokenPayload.sub },
    });

    if (!user) {
      user = await prisma.user.findUnique({
        where: { email: tokenPayload.email },
      });
    }

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Pengguna tidak ditemukan." },
        { status: 404 }
      );
    }

    // Check if email is already taken by another user
    if (email.toLowerCase() !== user.email.toLowerCase()) {
      const existingEmail = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      });

      if (existingEmail && existingEmail.id !== user.id) {
        return NextResponse.json(
          { success: false, message: "Email sudah digunakan oleh pengguna lain." },
          { status: 409 }
        );
      }
    }

    // Check if username is already taken by another user
    if (username.toLowerCase() !== user.username.toLowerCase()) {
      const existingUsername = await prisma.user.findUnique({
        where: { username: username.toLowerCase() },
      });

      if (existingUsername && existingUsername.id !== user.id) {
        return NextResponse.json(
          { success: false, message: "Username sudah digunakan oleh pengguna lain." },
          { status: 409 }
        );
      }
    }

    const now = new Date();
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        email: email.toLowerCase(),
        username: username.toLowerCase(),
        name: name.trim(),
        updatedAt: now,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Profile berhasil diperbarui.",
      user: {
        email: updatedUser.email,
        username: updatedUser.username,
        name: updatedUser.name,
      },
    });
  } catch (error) {
    console.error("[API] Update profile error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan saat memperbarui profile." },
      { status: 500 }
    );
  }
}

