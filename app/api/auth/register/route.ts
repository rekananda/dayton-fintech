import { NextResponse } from "next/server";
import { prisma } from "@/config/prisma";
import bcrypt from "bcryptjs";

type RegisterPayload = {
  username?: string;
  name?: string;
  email?: string;
  password?: string;
};

export async function POST(request: Request) {
  try {
    const { username, name, email, password }: RegisterPayload = await request.json();

    if (!name || name.trim().length < 3) {
      return NextResponse.json(
        { success: false, message: "Nama minimal 3 karakter." },
        { status: 400 }
      );
    }

    if (!username || username.trim().length < 3) {
      return NextResponse.json(
        { success: false, message: "Username minimal 3 karakter." },
        { status: 400 }
      );
    }

    if (!email || email.trim().length < 3) {
      return NextResponse.json(
        { success: false, message: "Email minimal 3 karakter." },
        { status: 400 }
      );
    }

    if (!password || password.length < 5) {
      return NextResponse.json(
        { success: false, message: "Password minimal 5 karakter." },
        { status: 400 }
      );
    }

    const existingEmail = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    const existingUsername = await prisma.user.findUnique({
      where: { username: username.toLowerCase() },
    });

    if (existingEmail) {
      return NextResponse.json(
        { success: false, message: "Email sudah terdaftar." },
        { status: 409 }
      );
    }

    if (existingUsername) {
      return NextResponse.json(
        { success: false, message: "Username sudah terdaftar." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        username: username.toLowerCase(),
        name: name.trim(),
        passwordHash,
      },
    });

    return NextResponse.json(
      { success: true, message: "Registrasi berhasil! Silakan login." },
      { status: 201 }
    );
  } catch (error) {
    console.error("[API] Register error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan saat registrasi." },
      { status: 500 }
    );
  }
}


