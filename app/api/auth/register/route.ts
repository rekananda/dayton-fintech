import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

type RegisterPayload = {
  name?: string;
  email?: string;
  password?: string;
};

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
    const { name, email, password }: RegisterPayload = await request.json();

    if (!name || name.trim().length < 3) {
      return NextResponse.json(
        { success: false, message: "Nama minimal 3 karakter." },
        { status: 400 }
      );
    }

    if (!email || email.trim().length < 3) {
      return NextResponse.json(
        { success: false, message: "Email/Username minimal 3 karakter." },
        { status: 400 }
      );
    }

    if (!password || password.length < 5) {
      return NextResponse.json(
        { success: false, message: "Password minimal 5 karakter." },
        { status: 400 }
      );
    }

    const normalizedEmail = normalizeIdentifier(email);

    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, message: "Email sudah terdaftar." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        email: normalizedEmail,
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


