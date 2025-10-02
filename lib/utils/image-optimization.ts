// lib/utils/image-optimization.ts
import { BLOB_CONFIG } from "@/lib/config/blob-config";

export interface ImageOptimizationResult {
  optimizedFile: File;
  originalSize: number;
  optimizedSize: number;
  compressionRatio: number;
}

/**
 * Check if we're running in a browser environment
 */
function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

/**
 * Optimize an image file before upload (browser version)
 */
async function optimizeImageBrowser(
  file: File
): Promise<ImageOptimizationResult> {
  const originalSize = file.size;

  // Create a canvas to resize and compress the image
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Canvas context not available");
  }

  // Create an image element to load the file
  const img = new Image();

  return new Promise((resolve, reject) => {
    img.onload = () => {
      try {
        // Calculate new dimensions while maintaining aspect ratio
        const { width: newWidth, height: newHeight } = calculateDimensions(
          img.width,
          img.height,
          BLOB_CONFIG.IMAGE_OPTIMIZATION.MAX_WIDTH,
          BLOB_CONFIG.IMAGE_OPTIMIZATION.MAX_HEIGHT
        );

        // Set canvas dimensions
        canvas.width = newWidth;
        canvas.height = newHeight;

        // Draw the resized image
        ctx.drawImage(img, 0, 0, newWidth, newHeight);

        // Convert to blob with compression
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Failed to optimize image"));
              return;
            }

            // Create a new File object with the optimized blob
            const optimizedFile = new File([blob], file.name, {
              type: getOptimizedMimeType(file.type),
              lastModified: file.lastModified,
            });

            const optimizedSize = optimizedFile.size;
            const compressionRatio =
              ((originalSize - optimizedSize) / originalSize) * 100;

            resolve({
              optimizedFile,
              originalSize,
              optimizedSize,
              compressionRatio,
            });
          },
          getOptimizedMimeType(file.type),
          getQualityForMimeType(file.type)
        );
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error("Failed to load image"));
    };

    // Load the image
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Optimize an image file before upload (server version - minimal processing)
 */
async function optimizeImageServer(
  file: File
): Promise<ImageOptimizationResult> {
  // On server, we'll do minimal processing - just validate and return the file
  // In a production environment, you might want to use a library like 'sharp' for server-side image processing

  const originalSize = file.size;

  // For now, just return the original file with minimal changes
  const optimizedFile = new File([file], file.name, {
    type: getOptimizedMimeType(file.type),
    lastModified: file.lastModified,
  });

  const optimizedSize = optimizedFile.size;
  const compressionRatio = 0; // No compression on server side for now

  return {
    optimizedFile,
    originalSize,
    optimizedSize,
    compressionRatio,
  };
}

/**
 * Optimize an image file before upload (main function)
 */
export async function optimizeImage(
  file: File
): Promise<ImageOptimizationResult> {
  if (isBrowser()) {
    return optimizeImageBrowser(file);
  } else {
    return optimizeImageServer(file);
  }
}

/**
 * Calculate new dimensions while maintaining aspect ratio
 */
function calculateDimensions(
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } {
  let { width, height } = { width: originalWidth, height: originalHeight };

  // Scale down if image is too large
  if (width > maxWidth || height > maxHeight) {
    const widthRatio = maxWidth / width;
    const heightRatio = maxHeight / height;
    const ratio = Math.min(widthRatio, heightRatio);

    width = Math.floor(width * ratio);
    height = Math.floor(height * ratio);
  }

  return { width, height };
}

/**
 * Get optimized MIME type (prefer WebP for better compression)
 */
function getOptimizedMimeType(originalType: string): string {
  // If original is already WebP, keep it
  if (originalType === "image/webp") {
    return "image/webp";
  }

  // Convert to WebP for better compression
  return "image/webp";
}

/**
 * Get quality setting based on MIME type
 */
function getQualityForMimeType(mimeType: string): number {
  if (mimeType === "image/jpeg" || mimeType === "image/jpg") {
    return BLOB_CONFIG.IMAGE_OPTIMIZATION.JPEG_QUALITY / 100;
  }

  if (mimeType === "image/webp") {
    return BLOB_CONFIG.IMAGE_OPTIMIZATION.WEBP_QUALITY / 100;
  }

  // Default quality for other formats
  return 0.8;
}

/**
 * Validate image file before optimization
 */
export function validateImageFile(file: File): {
  isValid: boolean;
  error?: string;
} {
  // Check file type
  if (!BLOB_CONFIG.ALLOWED_IMAGE_TYPES.includes(file.type as any)) {
    return {
      isValid: false,
      error: `Invalid file type. Allowed types: ${BLOB_CONFIG.ALLOWED_IMAGE_TYPES.join(
        ", "
      )}`,
    };
  }

  // Check file size
  if (file.size > BLOB_CONFIG.MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `File too large. Maximum size: ${Math.round(
        BLOB_CONFIG.MAX_FILE_SIZE / (1024 * 1024)
      )}MB`,
    };
  }

  return { isValid: true };
}
