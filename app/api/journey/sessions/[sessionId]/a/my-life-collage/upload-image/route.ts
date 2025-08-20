// app/api/journey/sessions/[sessionId]/a/my-life-collage/upload-image/route.ts
import { NextRequest, NextResponse } from "next/server";
import { CollageImageUploadService } from "@/lib/utils/collage-image-upload";
import { auth } from "@/app/(auth)/auth";
import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
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
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.",
        },
        { status: 400 }
      );
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 5MB." },
        { status: 400 }
      );
    }

    // Upload the image
    const uploadResult = await CollageImageUploadService.uploadImage(
      file,
      userEmail,
      imageType
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
  { params }: { params: { sessionId: string } }
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

    // Verify the image belongs to the user (optional security check)
    const userEmail = session.user.email;
    const sanitizedEmail = userEmail.replace(/[^a-zA-Z0-9@.-]/g, "_");

    if (!imageUrl.includes(`my-life-collage/${sanitizedEmail}`)) {
      return NextResponse.json(
        { error: "Unauthorized to delete this image" },
        { status: 403 }
      );
    }

    // Delete the image
    await CollageImageUploadService.deleteImage(imageUrl);

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
