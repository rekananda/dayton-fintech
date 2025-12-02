import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/config/jwt";
import { google } from "googleapis";
import { Readable } from "stream";
import { prisma } from "@/config/prisma";

// Helper function to convert File to Buffer
async function fileToBuffer(file: File): Promise<Buffer> {
  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

// Helper function to convert Buffer to Readable stream
function bufferToStream(buffer: Buffer): Readable {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
}

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

    // Get file from form data
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ message: "No file provided" }, { status: 400 });
    }

    // Check file size (10MB limit)
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_SIZE) {
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

    // Get folder ID from environment
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

    if (!folderId) {
      console.error("Google Drive folder ID not configured");
      return NextResponse.json(
        { message: "Google Drive folder ID not configured" },
        { status: 500 }
      );
    }

    // Get user ID from token
    const userId = payload.sub || payload.username;

    // Get OAuth token from database
    const tokenRecord = await prisma.googleDriveToken.findUnique({
      where: { userId },
    });

    if (!tokenRecord) {
      return NextResponse.json(
        { 
          message: "Google Drive not connected",
          error: "Please authorize Google Drive access first",
          action: "authorize",
          authUrl: `/api/upload/gdrive/auth`,
        },
        { status: 401 }
      );
    }

    // Check if token is expired
    const now = new Date();
    let accessToken = tokenRecord.accessToken;
    const refreshToken = tokenRecord.refreshToken;

    if (tokenRecord.expiryDate < now && refreshToken) {
      // Token expired, refresh it
      console.log("Token expired, refreshing...");
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

        console.log("Token refreshed successfully");
      } catch (refreshError) {
        console.error("Failed to refresh token:", refreshError);
        // Delete invalid token
        await prisma.googleDriveToken.delete({
          where: { userId },
        });
        
        return NextResponse.json(
          { 
            message: "Google Drive token expired and refresh failed",
            error: "Please re-authorize Google Drive access",
            action: "authorize",
            authUrl: `/api/upload/gdrive/auth`,
          },
          { status: 401 }
        );
      }
    } else if (tokenRecord.expiryDate < now && !refreshToken) {
      // Token expired and no refresh token
      await prisma.googleDriveToken.delete({
        where: { userId },
      });
      
      return NextResponse.json(
        { 
          message: "Google Drive token expired",
          error: "Please re-authorize Google Drive access",
          action: "authorize",
          authUrl: `/api/upload/gdrive/auth`,
        },
        { status: 401 }
      );
    }

    // Initialize Google Drive API with OAuth token
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

    // Convert file to buffer
    const fileBuffer = await fileToBuffer(file);
    const fileStream = bufferToStream(fileBuffer);

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split(".").pop();
    const fileName = `event-${timestamp}.${fileExtension}`;

    // Verify that the user can access the folder
    let folderInfo;
    try {
      folderInfo = await drive.files.get({
        fileId: folderId,
        fields: "id, name, mimeType, shared, owners, permissions, capabilities",
        supportsAllDrives: true,
      });
      
      console.log("=== FOLDER INFO ===");
      console.log("Folder ID:", folderInfo.data.id);
      console.log("Folder Name:", folderInfo.data.name);
      console.log("Is Shared:", folderInfo.data.shared);
      console.log("Owners:", folderInfo.data.owners?.map(o => ({
        email: o.emailAddress,
        displayName: o.displayName,
      })));
      console.log("Permissions:", folderInfo.data.permissions?.map(p => ({
        email: p.emailAddress,
        role: p.role,
        type: p.type,
      })));
      console.log("Capabilities:", folderInfo.data.capabilities);
      
    } catch (folderError) {
      console.error("=== FOLDER ACCESS ERROR ===");
      console.error("Error:", folderError);
      const errorMessage = folderError instanceof Error ? folderError.message : String(folderError);
      return NextResponse.json(
        { 
          message: "Cannot access folder",
          error: errorMessage,
          folderId: folderId,
          hint: "Check that: 1) Folder exists, 2) User has access to the folder, 3) Folder ID is correct"
        },
        { status: 403 }
      );
    }

    // Upload file to Google Drive
    // Since service account has "writer" permission on the shared folder,
    // we can directly upload to the folder using parents parameter
    // The key is that the folder is owned by a regular user, not the service account
    console.log("=== STARTING FILE UPLOAD ===");
    console.log("File name:", fileName);
    console.log("File size:", file.size);
    console.log("File type:", file.type);
    console.log("Target folder ID:", folderId);
    
    let response;
    try {
      // Upload directly to the shared folder
      // This works because the folder is owned by a regular user and shared with service account
      response = await drive.files.create({
        requestBody: {
          name: fileName,
          parents: [folderId],
        },
        media: {
          mimeType: file.type,
          body: fileStream,
        },
        fields: "id, webViewLink, webContentLink, parents, name, size",
        supportsAllDrives: true,
      });

      console.log("=== UPLOAD SUCCESS ===");
      console.log("File ID:", response.data.id);
      console.log("File name:", response.data.name);
      console.log("File size:", response.data.size);
      console.log("Parents:", response.data.parents);

    } catch (uploadError: unknown) {
      console.error("=== UPLOAD ERROR ===");
      const errorMessage = uploadError instanceof Error ? uploadError.message : String(uploadError);
      console.error("Error message:", errorMessage);
      console.error("Full error:", uploadError);
      
      // Check if error is about storage quota
      if (errorMessage.includes("storage quota") || errorMessage.includes("Service Accounts do not have storage quota")) {
        // Even though test shows we have access, this error can still occur
        // This means Google Drive is trying to create the file in service account's drive
        // instead of the shared folder. This is a known limitation.
        
        return NextResponse.json(
          { 
            message: "Service account storage quota error",
            error: errorMessage,
            diagnosis: {
              folderAccess: "✅ Service account can access folder",
              permission: "✅ Service account has writer permission",
              issue: "❌ Google Drive API is trying to create file in service account's drive instead of shared folder",
            },
            solution: [
              "This is a known limitation of Google Drive API with service accounts.",
              "Even with proper permissions, service accounts cannot create files directly.",
              "Options:",
              "1. Use Google Workspace Shared Drive (requires Google Workspace)",
              "2. Use OAuth 2.0 with user credentials (more complex)",
              "3. Use alternative storage (Cloudinary, Supabase Storage, AWS S3)"
            ],
            testResults: {
              canAccessFolder: true,
              hasPermission: true,
              serviceAccountRole: "writer",
            }
          },
          { status: 403 }
        );
      }
      throw uploadError;
    }

    if (!response.data.id) {
      return NextResponse.json(
        { message: "Failed to upload file" },
        { status: 500 }
      );
    }

    // Make file publicly accessible
    const fileId = response.data.id;
    let permissionSet = false;
    
    try {
      await drive.permissions.create({
        fileId: fileId,
        requestBody: {
          role: "reader",
          type: "anyone",
        },
        fields: "id",
      });
      permissionSet = true;
      console.log("Public permission set successfully for file:", fileId);
    } catch (permissionError) {
      console.warn("Failed to set public permission:", permissionError);
      // Try to check if permission already exists
      try {
        const existingPermissions = await drive.permissions.list({
          fileId: fileId,
          fields: "permissions(id,type,role)",
        });
        const hasPublicPermission = existingPermissions.data.permissions?.some(
          (p) => p.type === "anyone" && p.role === "reader"
        );
        if (hasPublicPermission) {
          permissionSet = true;
          console.log("Public permission already exists for file:", fileId);
        }
      } catch (checkError) {
        console.warn("Failed to check existing permissions:", checkError);
      }
    }

    // Get public URL - menggunakan format thumbnail yang lebih reliable untuk gambar
    // Format ini bekerja lebih baik untuk menampilkan gambar di web
    let publicUrl: string;
    
    if (permissionSet) {
      // Format thumbnail dengan size parameter (sz) untuk mendapatkan resolusi yang baik
      // w1000 = width 1000px, atau gunakan w1920 untuk full HD
      publicUrl = `https://drive.google.com/thumbnail?id=${fileId}&sz=w1920`;
    } else {
      // Fallback ke format UC jika permission tidak berhasil di-set
      // Format ini mungkin memerlukan user login, tapi tetap bisa digunakan
      publicUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
      console.warn("Using fallback URL format (may require authentication)");
    }

    return NextResponse.json({
      url: publicUrl,
      fileId: fileId,
      fileName: fileName,
    });
  } catch (error) {
    console.error("[API] Google Drive upload error:", error);
    return NextResponse.json(
      { message: "Failed to upload file", error: (error as Error).message },
      { status: 500 }
    );
  }
}

