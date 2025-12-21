import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/config/jwt";
import { calculateTotalStorageSize } from '../local/utils';
import mainConfig from '@/config';

export async function GET(request: NextRequest) {
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

    const currentSize = await calculateTotalStorageSize();
    const maxSize = mainConfig.maxStorageSize;
    const remaining = maxSize - currentSize;
    const usagePercent = (currentSize / maxSize) * 100;

    return NextResponse.json({
      useLocalStorage: mainConfig.useLocalStorage,
      currentSize,
      maxSize,
      remaining,
      usagePercent: Math.round(usagePercent * 100) / 100,
      currentSizeGB: parseFloat((currentSize / (1024 * 1024 * 1024)).toFixed(2)),
      maxSizeGB: parseFloat((maxSize / (1024 * 1024 * 1024)).toFixed(2)),
      remainingGB: parseFloat((remaining / (1024 * 1024 * 1024)).toFixed(2)),
      remainingMB: parseFloat((remaining / (1024 * 1024)).toFixed(2)),
    });
  } catch (error) {
    console.error("[API] Storage status error:", error);
    return NextResponse.json(
      { message: "Failed to get storage status", error: (error as Error).message },
      { status: 500 }
    );
  }
}

