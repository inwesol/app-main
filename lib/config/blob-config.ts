// lib/config/blob-config.ts
export const BLOB_CONFIG = {
  // Maximum file size in bytes (5MB)
  MAX_FILE_SIZE: 5 * 1024 * 1024,

  // Allowed image types
  ALLOWED_IMAGE_TYPES: [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
  ] as const,

  // Image optimization settings
  IMAGE_OPTIMIZATION: {
    // Maximum dimensions for uploaded images
    MAX_WIDTH: 1920,
    MAX_HEIGHT: 1080,
    // Quality for JPEG compression (0-100)
    JPEG_QUALITY: 85,
    // Quality for WebP compression (0-100)
    WEBP_QUALITY: 80,
  },

  // Storage settings
  STORAGE: {
    // Note: Vercel Blob currently only supports public access
    // Consider implementing signed URLs for better security
    ACCESS_LEVEL: "public" as const,
    // Add random suffix to prevent conflicts
    ADD_RANDOM_SUFFIX: true,
  },

  // Cleanup settings
  CLEANUP: {
    // Keep images for 30 days after last access
    RETENTION_DAYS: 30,
    // Batch size for cleanup operations
    BATCH_SIZE: 50,
  },
} as const;

export type AllowedImageType = (typeof BLOB_CONFIG.ALLOWED_IMAGE_TYPES)[number];
