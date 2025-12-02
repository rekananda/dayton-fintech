import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/config/jwt";
import { google } from "googleapis";

// Generate OAuth URL for user to authorize
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

    // Get OAuth credentials from environment
    const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_OAUTH_REDIRECT_URI || 
      `${request.nextUrl.origin}/api/upload/gdrive/callback`;

    if (!clientId || !clientSecret) {
      return NextResponse.json(
        { 
          message: "Google OAuth credentials not configured",
          hint: "Please set GOOGLE_OAUTH_CLIENT_ID and GOOGLE_OAUTH_CLIENT_SECRET in .env.local"
        },
        { status: 500 }
      );
    }

    // Create OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      redirectUri
    );

    // Generate auth URL
    const scopes = [
      'https://www.googleapis.com/auth/drive.file',
      'https://www.googleapis.com/auth/drive',
    ];

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent', // Force consent to get refresh token
      state: payload.username, // Store username in state for verification
    });

    return NextResponse.json({
      authUrl,
      message: "Please authorize Google Drive access",
    });
  } catch (error) {
    console.error("[API] OAuth auth error:", error);
    return NextResponse.json(
      { message: "Failed to generate auth URL", error: (error as Error).message },
      { status: 500 }
    );
  }
}

