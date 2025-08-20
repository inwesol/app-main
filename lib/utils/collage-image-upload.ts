// lib/utils/collage-image-upload.ts
import { put, del } from "@vercel/blob";

export interface CollageImageUploadResult {
  url: string;
  pathname: string;
  size: number;
}

export class CollageImageUploadService {
  private static getImagePath(userEmail: string, fileName: string): string {
    // Sanitize email for use in path
    const sanitizedEmail = userEmail.replace(/[^a-zA-Z0-9@.-]/g, "_");
    return `my-life-collage/${sanitizedEmail}/${fileName}`;
  }

  /**
   * Upload a single image to Vercel Blob
   */
  static async uploadImage(
    file: File,
    userEmail: string,
    imageType: "present" | "future" = "present"
  ): Promise<CollageImageUploadResult> {
    try {
      // Generate unique filename with timestamp
      const timestamp = Date.now();
      const fileExtension = file.name.split(".").pop() || "jpg";
      const fileName = `${imageType}-${timestamp}.${fileExtension}`;
      const pathname = this.getImagePath(userEmail, fileName);

      // Upload to Vercel Blob
      const blob = await put(pathname, file, {
        access: "public",
        addRandomSuffix: false, // We're already adding timestamp for uniqueness
      });

      return {
        url: blob.url,
        pathname: blob.pathname,
        size: file.size,
      };
    } catch (error) {
      console.error("Error uploading image to Vercel Blob:", error);
      throw new Error("Failed to upload image");
    }
  }

  /**
   * Upload multiple images at once
   */
  static async uploadImages(
    files: File[],
    userEmail: string,
    imageType: "present" | "future" = "present"
  ): Promise<CollageImageUploadResult[]> {
    try {
      const uploadPromises = files.map((file) =>
        this.uploadImage(file, userEmail, imageType)
      );

      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error("Error uploading multiple images:", error);
      throw new Error("Failed to upload images");
    }
  }

  /**
   * Delete an image from Vercel Blob
   */
  static async deleteImage(imageUrl: string): Promise<void> {
    try {
      await del(imageUrl);
    } catch (error) {
      console.error("Error deleting image from Vercel Blob:", error);
      throw new Error("Failed to delete image");
    }
  }

  /**
   * Delete multiple images
   */
  static async deleteImages(imageUrls: string[]): Promise<void> {
    try {
      const deletePromises = imageUrls.map((url) => this.deleteImage(url));
      await Promise.all(deletePromises);
    } catch (error) {
      console.error("Error deleting multiple images:", error);
      throw new Error("Failed to delete images");
    }
  }

  /**
   * Clean up old images for a user (optional utility)
   */
  static async cleanupUserImages(userEmail: string): Promise<void> {
    try {
      // Note: Vercel Blob doesn't have a direct "list by prefix" API
      // You might need to track uploaded images in your database
      // and delete them based on stored URLs
      console.log(`Cleanup requested for user: ${userEmail}`);
      // Implementation depends on how you track uploaded images
    } catch (error) {
      console.error("Error cleaning up user images:", error);
      throw new Error("Failed to cleanup user images");
    }
  }
}
