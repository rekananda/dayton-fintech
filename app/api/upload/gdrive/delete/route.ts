import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/config/jwt";
import { google } from "googleapis";
import { prisma } from "@/config/prisma";

// Helper function to extract file ID from Google Drive URL
export function extractFileIdFromUrl(url: string): string | null {
  // Format: https://drive.google.com/thumbnail?id=FILE_ID&sz=w1920
  // Format: https://drive.google.com/uc?export=view&id=FILE_ID
  const thumbnailMatch = url.match(/drive\.google\.com\/thumbnail\?id=([^&]+)/);
  const ucMatch = url.match(/drive\.google\.com\/uc\?[^&]*id=([^&]+)/);
  
  if (thumbnailMatch) {
    return thumbnailMatch[1];
  }
  
  if (ucMatch) {
    return ucMatch[1];
  }
  
  // Try direct file ID pattern
  const directIdMatch = url.match(/\/d\/([^\/]+)/);
  if (directIdMatch) {
    return directIdMatch[1];
  }
  
  return null;
}

// Check if URL is from Google Drive
export function isGoogleDriveUrl(url: string): boolean {
  return url.includes('drive.google.com') || extractFileIdFromUrl(url) !== null;
}

// Delete file from Google Drive
export async function deleteFileFromGoogleDrive(fileId: string, userId: string): Promise<boolean> {
  try {
    // Get OAuth token from database
    const tokenRecord = await prisma.googleDriveToken.findUnique({
      where: { userId },
    });

    if (!tokenRecord) {
      console.warn("No Google Drive token found for user:", userId);
      return false;
    }

    // Check if token is expired and refresh if needed
    const now = new Date();
    let accessToken = tokenRecord.accessToken;
    const refreshToken = tokenRecord.refreshToken;

    if (tokenRecord.expiryDate < now && refreshToken) {
      try {
        const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
        const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
        const redirectUri = process.env.GOOGLE_OAUTH_REDIRECT_URI || 
          `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/upload/gdrive/callback`;

        if (!clientId || !clientSecret) {
          throw new Error("OAuth credentials not configured");
        }

        const oauth2Client = new google.auth.OAuth2(
          clientId,
          clientSecret,
          redirectUri
        );

        oauth2Client.setCredentials({
          refresh_token: refreshToken,
        });

        const { credentials } = await oauth2Client.refreshAccessToken();
        
        if (!credentials.access_token) {
          throw new Error("Failed to refresh access token");
        }

        accessToken = credentials.access_token;
        const newExpiryDate = credentials.expiry_date 
          ? new Date(credentials.expiry_date)
          : new Date(Date.now() + 3600 * 1000);

        // Update token in database
        await prisma.googleDriveToken.update({
          where: { userId },
          data: {
            accessToken: credentials.access_token,
            refreshToken: credentials.refresh_token || refreshToken,
            expiryDate: newExpiryDate,
            updatedAt: new Date(),
          },
        });
      } catch (refreshError) {
        console.error("Failed to refresh token:", refreshError);
        return false;
      }
    }

    // Initialize Google Drive API
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_OAUTH_CLIENT_ID,
      process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      process.env.GOOGLE_OAUTH_REDIRECT_URI
    );

    oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    const drive = google.drive({ version: "v3", auth: oauth2Client });

    // Delete file from Google Drive
    await drive.files.delete({
      fileId: fileId,
      supportsAllDrives: true,
    });

    console.log(`Successfully deleted file ${fileId} from Google Drive`);
    return true;
  } catch (error) {
    console.error(`Failed to delete file ${fileId} from Google Drive:`, error);
    // Don't throw error, just return false so event can still be deleted
    return false;
  }
}

// API endpoint for deleting file from Google Drive
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload || !payload.username) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const body = await request.json();
    const { fileId, imageUrl } = body;

    if (!fileId && !imageUrl) {
      return NextResponse.json({ message: "File ID or image URL required" }, { status: 400 });
    }

    const userId = payload.sub || payload.username;
    let actualFileId = fileId;

    // Extract file ID from URL if URL provided
    if (imageUrl && !fileId) {
      actualFileId = extractFileIdFromUrl(imageUrl);
      if (!actualFileId) {
        return NextResponse.json({ message: "Invalid Google Drive URL" }, { status: 400 });
      }
    }

    const success = await deleteFileFromGoogleDrive(actualFileId, userId);

    if (success) {
      return NextResponse.json({ message: "File deleted successfully" });
    } else {
      return NextResponse.json(
        { message: "Failed to delete file from Google Drive" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("[API] Delete file from Google Drive error:", error);
    return NextResponse.json(
      { message: "Failed to delete file", error: (error as Error).message },
      { status: 500 }
    );
  }
}

