import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/config/jwt";
import { google } from "googleapis";
import { prisma } from "@/config/prisma";

// Handle OAuth callback and store tokens
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    if (error) {
      return NextResponse.redirect(
        new URL(`/backoffice/events?error=${encodeURIComponent(error)}`, request.url)
      );
    }

    if (!code || !state) {
      return NextResponse.redirect(
        new URL("/backoffice/events?error=missing_code_or_state", request.url)
      );
    }

    // Verify user is authenticated
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.redirect(
        new URL("/backoffice/login", request.url)
      );
    }

    const payload = await verifyToken(token);
    if (!payload || !payload.username || payload.username !== state) {
      return NextResponse.redirect(
        new URL("/backoffice/events?error=invalid_state", request.url)
      );
    }

    // Get OAuth credentials
    const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_OAUTH_REDIRECT_URI || 
      `${request.nextUrl.origin}/api/upload/gdrive/callback`;

    if (!clientId || !clientSecret) {
      return NextResponse.redirect(
        new URL("/backoffice/events?error=oauth_not_configured", request.url)
      );
    }

    // Create OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      redirectUri
    );

    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code);

    if (!tokens.access_token) {
      return NextResponse.redirect(
        new URL("/backoffice/events?error=no_access_token", request.url)
      );
    }

    // Store tokens in database
    const userId = payload.sub || payload.username;
    const expiryDate = tokens.expiry_date 
      ? new Date(tokens.expiry_date)
      : new Date(Date.now() + 3600 * 1000); // Default 1 hour

    // Check if prisma.googleDriveToken exists
    if (!prisma.googleDriveToken) {
      console.error("[API] Prisma client: googleDriveToken model not found");
      console.error("[API] Available models:", Object.keys(prisma).filter(key => !key.startsWith('$') && !key.startsWith('_')));
      return NextResponse.redirect(
        new URL("/backoffice/events?error=prisma_model_not_found", request.url)
      );
    }

    try {
      await prisma.googleDriveToken.upsert({
        where: { userId },
        create: {
          userId,
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token || null,
          expiryDate,
          scope: tokens.scope || null,
        },
        update: {
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token || null,
          expiryDate,
          scope: tokens.scope || null,
          updatedAt: new Date(),
        },
      });
    } catch (dbError) {
      console.error("[API] Database error:", dbError);
      return NextResponse.redirect(
        new URL(`/backoffice/events?error=${encodeURIComponent((dbError as Error).message)}`, request.url)
      );
    }

    // Redirect back to events page with success
    return NextResponse.redirect(
      new URL("/backoffice/events?google_drive_connected=true", request.url)
    );
  } catch (error) {
    console.error("[API] OAuth callback error:", error);
    return NextResponse.redirect(
      new URL(`/backoffice/events?error=${encodeURIComponent((error as Error).message)}`, request.url)
    );
  }
}

