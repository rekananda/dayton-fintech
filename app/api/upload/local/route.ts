import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/config/jwt";
import { promises as fs } from 'fs';
import path from 'path';
import { ensureDirectoryExists, hasEnoughSpace } from './utils';
import mainConfig from '@/config';

const EVENTS_IMAGE_DIR = path.join(process.cwd(), 'public', 'events', 'img');

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload || !payload.username) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    // Check if local storage is enabled
    if (!mainConfig.useLocalStorage) {
      return NextResponse.json(
        { message: "Local storage is not enabled. Please use Google Drive." },
        { status: 400 }
      );
    }

    // Get file from form data
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ message: "No file provided" }, { status: 400 });
    }

    // Check file size (10MB limit per file)
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { message: "File size exceeds 10MB limit" },
        { status: 400 }
      );
    }

    // Check file type (images only)
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { message: "Only image files are allowed" },
        { status: 400 }
      );
    }

    // Check if there's enough storage space
    const storageCheck = await hasEnoughSpace(file.size);
    if (!storageCheck.hasSpace) {
      const usedGB = (storageCheck.currentSize / (1024 * 1024 * 1024)).toFixed(2);
      const maxGB = (storageCheck.maxSize / (1024 * 1024 * 1024)).toFixed(2);
      const remainingMB = (storageCheck.remaining / (1024 * 1024)).toFixed(2);
      
      return NextResponse.json(
        {
          message: "Storage limit exceeded",
          error: `Storage limit reached. Used: ${usedGB}GB / ${maxGB}GB. Remaining: ${remainingMB}MB. Please delete some files to free up space.`,
          storageInfo: {
            currentSize: storageCheck.currentSize,
            maxSize: storageCheck.maxSize,
            remaining: storageCheck.remaining,
            usedGB: parseFloat(usedGB),
            maxGB: parseFloat(maxGB),
            remainingMB: parseFloat(remainingMB),
          },
        },
        { status: 413 }
      );
    }

    // Ensure directory exists
    await ensureDirectoryExists();

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split(".").pop();
    const fileName = `event-${timestamp}.${fileExtension}`;
    const filePath = path.join(EVENTS_IMAGE_DIR, fileName);

    // Write file to disk
    await fs.writeFile(filePath, buffer);

    // Return public URL
    const publicUrl = `/events/img/${fileName}`;

    return NextResponse.json({
      url: publicUrl,
      fileName: fileName,
      fileSize: file.size,
    });
  } catch (error) {
    console.error("[API] Local storage upload error:", error);
    return NextResponse.json(
      { message: "Failed to upload file", error: (error as Error).message },
      { status: 500 }
    );
  }
}

