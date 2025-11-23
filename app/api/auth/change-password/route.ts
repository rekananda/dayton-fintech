import { NextResponse } from "next/server";
import { prisma } from "@/config/prisma";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { verifyToken } from "@/config/jwt";

type ChangePasswordPayload = {
  oldPassword?: string;
  newPassword?: string;
};

export async function POST(request: Request) {
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

    const { oldPassword, newPassword }: ChangePasswordPayload = await request.json();

    if (!oldPassword || !newPassword) {
      return NextResponse.json(
        { success: false, message: "Password lama & baru wajib diisi." },
        { status: 400 }
      );
    }

    if (newPassword.length < 5) {
      return NextResponse.json(
        { success: false, message: "Password baru minimal 5 karakter." },
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

    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!isOldPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Password lama tidak sesuai." },
        { status: 400 }
      );
    }

    if (oldPassword === newPassword) {
      return NextResponse.json(
        { success: false, message: "Password baru harus berbeda dari sebelumnya." },
        { status: 400 }
      );
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: newPasswordHash },
    });

    return NextResponse.json({
      success: true,
      message: "Password berhasil diperbarui.",
    });
  } catch (error) {
    console.error("[API] Change password error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan saat mengubah password." },
      { status: 500 }
    );
  }
}


