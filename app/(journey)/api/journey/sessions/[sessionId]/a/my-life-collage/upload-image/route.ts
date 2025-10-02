// app/api/journey/sessions/[sessionId]/a/my-life-collage/upload-image/route.ts
import { type NextRequest, NextResponse } from "next/server";
import { uploadImage, deleteImage } from "@/lib/utils/collage-image-upload";
import { auth } from "@/app/(auth)/auth";
import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { BLOB_CONFIG } from "@/lib/config/blob-config";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    // Get the authenticated session
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user details from database
    const userData = await db
      .select()
      .from(user)
      .where(eq(user.email, session.user.email))
      .limit(1);

    if (!userData.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userEmail = userData[0].email;

    // Parse the multipart form data
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const imageType =
      (formData.get("imageType") as "present" | "future") || "present";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (!BLOB_CONFIG.ALLOWED_IMAGE_TYPES.includes(file.type as any)) {
      return NextResponse.json(
        {
          error: `Invalid file type. Allowed types: ${BLOB_CONFIG.ALLOWED_IMAGE_TYPES.join(
            ", "
          )}`,
        },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > BLOB_CONFIG.MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: `File too large. Maximum size: ${Math.round(
            BLOB_CONFIG.MAX_FILE_SIZE / (1024 * 1024)
          )}MB`,
        },
        { status: 400 }
      );
    }

    // Get session ID
    const { sessionId } = await params;

    // Upload the image with optimization and tracking
    const uploadResult = await uploadImage(
      file,
      userEmail,
      userData[0].id,
      imageType,
      sessionId
    );

    return NextResponse.json({
      success: true,
      data: uploadResult,
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    // Get the authenticated session
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { imageUrl } = await request.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL is required" },
        { status: 400 }
      );
    }

    // Get user details for security check
    const userData = await db
      .select()
      .from(user)
      .where(eq(user.email, session.user.email))
      .limit(1);

    if (!userData.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Delete the image with user verification
    await deleteImage(imageUrl, userData[0].id);

    return NextResponse.json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    );
  }
}
