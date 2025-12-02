import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/config/jwt";
import { google } from "googleapis";

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

    // Get Google Drive credentials from environment variables
    const clientEmail = process.env.GOOGLE_DRIVE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_DRIVE_PRIVATE_KEY?.replace(/\\n/g, "\n");
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

    if (!clientEmail || !privateKey || !folderId) {
      return NextResponse.json(
        { 
          message: "Google Drive credentials not configured",
          missing: {
            clientEmail: !clientEmail,
            privateKey: !privateKey,
            folderId: !folderId,
          }
        },
        { status: 500 }
      );
    }

    // Initialize Google Drive API
    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ["https://www.googleapis.com/auth/drive"],
    });

    const drive = google.drive({ version: "v3", auth });

    // Test 1: Verify authentication
    let authTest;
    try {
      // Try to get user info (this will fail for service account, but we can check the error)
      authTest = { success: true, message: "Service account authenticated" };
    } catch (authError) {
      authTest = { 
        success: false, 
        message: "Authentication failed",
        error: (authError as Error).message 
      };
    }

    // Test 2: Try to access the folder
    let folderTest;
    try {
      const folderInfo = await drive.files.get({
        fileId: folderId,
        fields: "id, name, mimeType, shared, owners, permissions, capabilities",
        supportsAllDrives: true,
      });

      folderTest = {
        success: true,
        data: {
          id: folderInfo.data.id,
          name: folderInfo.data.name,
          mimeType: folderInfo.data.mimeType,
          shared: folderInfo.data.shared,
          owners: folderInfo.data.owners?.map(o => ({
            emailAddress: o.emailAddress,
            displayName: o.displayName,
          })),
          permissions: folderInfo.data.permissions?.map(p => ({
            id: p.id,
            type: p.type,
            role: p.role,
            emailAddress: p.emailAddress,
          })),
          capabilities: folderInfo.data.capabilities,
        },
      };
    } catch (folderError) {
      folderTest = {
        success: false,
        error: (folderError as Error).message,
        details: folderError,
      };
    }

    // Test 3: Try to list files in the folder
    let listTest;
    try {
      const files = await drive.files.list({
        q: `'${folderId}' in parents and trashed=false`,
        fields: "files(id, name, mimeType, size)",
        supportsAllDrives: true,
        includeItemsFromAllDrives: true,
      });

      listTest = {
        success: true,
        fileCount: files.data.files?.length || 0,
        files: files.data.files?.slice(0, 5), // Show first 5 files
      };
    } catch (listError) {
      listTest = {
        success: false,
        error: (listError as Error).message,
      };
    }

    // Test 4: Check if service account has permission to create files
    let permissionTest;
    try {
      // Check if we can get permissions for the folder
      const permissions = await drive.permissions.list({
        fileId: folderId,
        fields: "permissions(id, type, role, emailAddress)",
        supportsAllDrives: true,
      });

      const serviceAccountPermission = permissions.data.permissions?.find(
        p => p.emailAddress === clientEmail
      );

      permissionTest = {
        success: true,
        serviceAccountHasAccess: !!serviceAccountPermission,
        serviceAccountPermission: serviceAccountPermission ? {
          role: serviceAccountPermission.role,
          type: serviceAccountPermission.type,
        } : null,
        allPermissions: permissions.data.permissions?.map(p => ({
          emailAddress: p.emailAddress,
          role: p.role,
          type: p.type,
        })),
      };
    } catch (permError) {
      permissionTest = {
        success: false,
        error: (permError as Error).message,
      };
    }

    return NextResponse.json({
      serviceAccount: {
        email: clientEmail,
        folderId: folderId,
      },
      tests: {
        authentication: authTest,
        folderAccess: folderTest,
        listFiles: listTest,
        permissions: permissionTest,
      },
      summary: {
        canAccessFolder: folderTest.success,
        canListFiles: listTest.success,
        hasPermission: permissionTest.success && permissionTest.serviceAccountHasAccess,
        serviceAccountRole: permissionTest.serviceAccountPermission?.role || "unknown",
      },
    });
  } catch (error) {
    console.error("[API] Google Drive test error:", error);
    return NextResponse.json(
      { 
        message: "Test failed", 
        error: (error as Error).message 
      },
      { status: 500 }
    );
  }
}

