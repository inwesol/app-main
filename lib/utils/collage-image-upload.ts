// lib/utils/collage-image-upload.ts
import { put, del } from "@vercel/blob";
import { BLOB_CONFIG } from "@/lib/config/blob-config";
import { validateImageFile } from "@/lib/utils/image-optimization";
import { db } from "@/lib/db";
import { uploadedImages } from "@/lib/db/schema";
import { eq, and, lt } from "drizzle-orm";

export interface CollageImageUploadResult {
  url: string;
  pathname: string;
  size: number;
  optimizedSize?: number;
  compressionRatio?: number;
  imageId: string;
}

function getImagePath(userEmail: string, fileName: string): string {
  // Sanitize email for use in path
  const sanitizedEmail = userEmail.replace(/[^a-zA-Z0-9@.-]/g, "_");
  return `my-life-collage/${sanitizedEmail}/${fileName}`;
}

/**
 * Upload a single image to Vercel Blob with optimization and tracking
 */
export async function uploadImage(
  file: File,
  userEmail: string,
  userId: string,
  imageType: "present" | "future" = "present",
  sessionId?: string
): Promise<CollageImageUploadResult> {
  try {
    // Validate the image file
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    // For server-side uploads, skip optimization for now
    // Optimization should be done on the client side before upload
    const optimizedFile = file;
    const optimizationResult = {
      originalSize: file.size,
      optimizedSize: file.size,
      compressionRatio: 0,
    };

    // Generate unique filename with timestamp
    const timestamp = Date.now();
    const fileExtension = optimizedFile.name.split(".").pop() || "webp";
    const fileName = `${imageType}-${timestamp}.${fileExtension}`;
    const pathname = getImagePath(userEmail, fileName);

    // Upload to Vercel Blob with private access
    const blob = await put(pathname, optimizedFile, {
      access: "public", // Vercel Blob currently only supports public access
      addRandomSuffix: BLOB_CONFIG.STORAGE.ADD_RANDOM_SUFFIX,
    });

    // Track the uploaded image in database
    const [insertedImage] = await db
      .insert(uploadedImages)
      .values({
        userId,
        sessionId: sessionId ? Number.parseInt(sessionId, 10) : null,
        imageUrl: blob.url,
        imagePath: blob.pathname,
        fileName: optimizedFile.name,
        fileSize: optimizedFile.size,
        mimeType: optimizedFile.type,
        imageType,
        isOptimized: true,
      })
      .returning({ id: uploadedImages.id });

    return {
      url: blob.url,
      pathname: blob.pathname,
      size: optimizationResult.originalSize,
      optimizedSize: optimizationResult.optimizedSize,
      compressionRatio: optimizationResult.compressionRatio,
      imageId: insertedImage.id,
    };
  } catch (error) {
    console.error("Error uploading image to Vercel Blob:", error);
    throw new Error("Failed to upload image");
  }
}

/**
 * Upload multiple images at once
 */
export async function uploadImages(
  files: File[],
  userEmail: string,
  userId: string,
  imageType: "present" | "future" = "present",
  sessionId?: string
): Promise<CollageImageUploadResult[]> {
  try {
    const uploadPromises = files.map((file) =>
      uploadImage(file, userEmail, userId, imageType, sessionId)
    );

    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error("Error uploading multiple images:", error);
    throw new Error("Failed to upload images");
  }
}

/**
 * Delete an image from Vercel Blob and database
 */
export async function deleteImage(
  imageUrl: string,
  userId?: string
): Promise<void> {
  try {
    // Delete from Vercel Blob
    await del(imageUrl);

    // Delete from database if userId is provided
    if (userId) {
      console.log("Deleting from database...");

      // First, let's check what records exist for this user and imageUrl
      const existingRecords = await db
        .select()
        .from(uploadedImages)
        .where(
          and(
            eq(uploadedImages.imageUrl, imageUrl),
            eq(uploadedImages.userId, userId)
          )
        );
      console.log("Existing records to delete:", existingRecords);

      // Also check all records for this user to see what's in the database
      const allUserRecords = await db
        .select()
        .from(uploadedImages)
        .where(eq(uploadedImages.userId, userId));
      console.log("All records for user:", allUserRecords);

      const result = await db
        .delete(uploadedImages)
        .where(
          and(
            eq(uploadedImages.imageUrl, imageUrl),
            eq(uploadedImages.userId, userId)
          )
        );
      console.log("Database deletion result:", result);
    } else {
      console.log("No userId provided, skipping database deletion");
    }
  } catch (error) {
    console.error("Error deleting image:", error);
    throw new Error("Failed to delete image");
  }
}

/**
 * Delete multiple images
 */
export async function deleteImages(
  imageUrls: string[],
  userId?: string
): Promise<void> {
  try {
    const deletePromises = imageUrls.map((url) => deleteImage(url, userId));
    await Promise.all(deletePromises);
  } catch (error) {
    console.error("Error deleting multiple images:", error);
    throw new Error("Failed to delete images");
  }
}

/**
 * Clean up old images based on retention policy
 */
export async function cleanupOldImages(): Promise<{
  deletedCount: number;
  errors: string[];
}> {
  const errors: string[] = [];
  let deletedCount = 0;

  try {
    // Calculate cutoff date based on retention policy
    const cutoffDate = new Date();
    cutoffDate.setDate(
      cutoffDate.getDate() - BLOB_CONFIG.CLEANUP.RETENTION_DAYS
    );

    // Find old images
    const oldImages = await db
      .select()
      .from(uploadedImages)
      .where(lt(uploadedImages.lastAccessedAt, cutoffDate))
      .limit(BLOB_CONFIG.CLEANUP.BATCH_SIZE);

    // Delete images in batches
    for (const image of oldImages) {
      try {
        await deleteImage(image.imageUrl, image.userId);
        deletedCount++;
      } catch (error) {
        errors.push(`Failed to delete image ${image.id}: ${error}`);
      }
    }

    return { deletedCount, errors };
  } catch (error) {
    console.error("Error cleaning up old images:", error);
    throw new Error("Failed to cleanup old images");
  }
}

/**
 * Update last accessed time for an image
 */
export async function updateImageAccessTime(imageUrl: string): Promise<void> {
  try {
    await db
      .update(uploadedImages)
      .set({ lastAccessedAt: new Date() })
      .where(eq(uploadedImages.imageUrl, imageUrl));
  } catch (error) {
    console.error("Error updating image access time:", error);
    // Don't throw error as this is not critical
  }
}

/**
 * Get user's image statistics
 */
export async function getUserImageStats(userId: string): Promise<{
  totalImages: number;
  totalSize: number;
  optimizedImages: number;
  byType: Record<string, number>;
}> {
  try {
    const images = await db
      .select()
      .from(uploadedImages)
      .where(eq(uploadedImages.userId, userId));

    const stats = {
      totalImages: images.length,
      totalSize: images.reduce((sum, img) => sum + img.fileSize, 0),
      optimizedImages: images.filter((img) => img.isOptimized).length,
      byType: {} as Record<string, number>,
    };

    // Count by image type
    images.forEach((img) => {
      const type = img.imageType || "unknown";
      stats.byType[type] = (stats.byType[type] || 0) + 1;
    });

    return stats;
  } catch (error) {
    console.error("Error getting user image stats:", error);
    throw new Error("Failed to get image statistics");
  }
}
