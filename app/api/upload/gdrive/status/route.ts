import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/config/jwt";
import { prisma } from "@/config/prisma";

// Check Google Drive connection status
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ connected: false, message: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload || !payload.username) {
      return NextResponse.json({ connected: false, message: "Invalid token" }, { status: 401 });
    }

    // Get user ID from token
    const userId = payload.sub || payload.username;

    // Check if token exists in database
    const tokenRecord = await prisma.googleDriveToken.findUnique({
      where: { userId },
      select: {
        id: true,
        refreshToken: true,
        expiryDate: true,
      },
    });

    if (!tokenRecord) {
      return NextResponse.json({ 
        connected: false,
        message: "Google Drive not connected",
      });
    }

    // Check if token is expired (but might still be refreshable)
    const now = new Date();
    const isExpired = tokenRecord.expiryDate < now;
    const hasRefreshToken = !!tokenRecord.refreshToken;

    // Token exists but expired - can still be used if has refresh token
    if (isExpired && !hasRefreshToken) {
      // Token expired and no refresh token - needs re-authorization
      return NextResponse.json({ 
        connected: false,
        message: "Token expired, please reconnect",
        needsReconnect: true,
      });
    }

    // Token exists and is valid (or can be refreshed)
    return NextResponse.json({ 
      connected: true,
      message: "Google Drive connected",
      isExpired,
      canRefresh: hasRefreshToken,
    });
  } catch (error) {
    console.error("[API] Google Drive status check error:", error);
    return NextResponse.json(
      { 
        connected: false,
        message: "Failed to check connection status",
        error: (error as Error).message 
      },
      { status: 500 }
    );
  }
}

