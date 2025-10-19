# Image Storage System Documentation

## Overview

The image storage system has been enhanced with security, optimization, and cleanup features for the My Life Collage component.

## Features

### 🔒 Security Improvements

- **Private Access**: Images are now stored with `access: "private"` instead of public
- **User Verification**: All image operations verify user ownership
- **Path Sanitization**: User emails are sanitized for safe path generation

### 🚀 Performance Optimizations

- **Automatic Compression**: Images are automatically compressed and resized
- **WebP Conversion**: Images are converted to WebP format for better compression
- **Size Limits**: Configurable maximum dimensions (1920x1080) and file size (5MB)
- **Quality Settings**: Optimized quality settings for different image types

### 🧹 Cleanup & Management

- **Database Tracking**: All uploaded images are tracked in the database
- **Retention Policy**: Automatic cleanup of images older than 30 days
- **Usage Statistics**: Track image usage and storage consumption
- **Batch Operations**: Efficient batch cleanup and deletion

## Configuration

### Environment Variables

```bash
# Required for Vercel Blob
BLOB_READ_WRITE_TOKEN="your-vercel-blob-token-here"
```

### Configuration File

Located at `lib/config/blob-config.ts`:

```typescript
export const BLOB_CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  IMAGE_OPTIMIZATION: {
    MAX_WIDTH: 1920,
    MAX_HEIGHT: 1080,
    JPEG_QUALITY: 85,
    WEBP_QUALITY: 80,
  },
  STORAGE: {
    ACCESS_LEVEL: "private",
    ADD_RANDOM_SUFFIX: true,
  },
  CLEANUP: {
    RETENTION_DAYS: 30,
    BATCH_SIZE: 50,
  },
};
```

## Database Schema

### uploaded_images Table

```sql
CREATE TABLE uploaded_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    session_id UUID,
    image_url TEXT NOT NULL UNIQUE,
    image_path TEXT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    image_type VARCHAR(50),
    is_optimized BOOLEAN DEFAULT FALSE NOT NULL,
    last_accessed_at TIMESTAMP DEFAULT NOW() NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

## API Endpoints

### Upload Image

```
POST /api/journey/sessions/[sessionId]/a/my-life-collage/upload-image
```

**Request:**

- `file`: Image file (multipart/form-data)
- `imageType`: "present" or "future"

**Response:**

```json
{
  "success": true,
  "data": {
    "url": "https://blob.vercel-storage.com/...",
    "pathname": "my-life-collage/user@example.com/present-1234567890.webp",
    "size": 1024000,
    "optimizedSize": 512000,
    "compressionRatio": 50.0,
    "imageId": "uuid-here"
  }
}
```

### Delete Image

```
DELETE /api/journey/sessions/[sessionId]/a/my-life-collage/upload-image
```

**Request:**

```json
{
  "imageUrl": "https://blob.vercel-storage.com/..."
}
```

### Cleanup Images (Admin)

```
POST /api/admin/cleanup-images
GET /api/admin/cleanup-images
```

## Usage Examples

### Uploading Images

```typescript
import { uploadImage } from "@/lib/utils/collage-image-upload";

const result = await uploadImage(file, userEmail, userId, "present", sessionId);
```

### Getting User Statistics

```typescript
import { getUserImageStats } from "@/lib/utils/collage-image-upload";

const stats = await getUserImageStats(userId);
console.log(
  `User has ${stats.totalImages} images using ${stats.totalSize} bytes`
);
```

### Running Cleanup

```typescript
import { cleanupOldImages } from "@/lib/utils/collage-image-upload";

const result = await cleanupOldImages();
console.log(`Deleted ${result.deletedCount} old images`);
```

## Migration

### 1. Run Database Migration

```bash
# SQL migration
psql -d your_database -f scripts/create-uploaded-images-table.sql

# Or TypeScript migration
npx tsx scripts/migrate-uploaded-images-table.ts
```

### 2. Set Environment Variables

```bash
# Add to your .env.local
BLOB_READ_WRITE_TOKEN="your-vercel-blob-token-here"
```

### 3. Deploy Configuration

The new configuration will be automatically applied when the application starts.

## Monitoring

### Image Statistics

- Total images per user
- Storage usage per user
- Optimization statistics
- Image type distribution

### Cleanup Monitoring

- Number of images deleted
- Cleanup errors
- Storage space freed

## Security Considerations

1. **Private Access**: All images are stored with private access
2. **User Verification**: All operations verify user ownership
3. **Path Sanitization**: User emails are sanitized for safe storage paths
4. **File Validation**: Strict file type and size validation
5. **Access Logging**: Track when images are accessed for cleanup decisions

## Performance Benefits

1. **Reduced Storage**: 30-70% size reduction through optimization
2. **Faster Loading**: WebP format and compression improve load times
3. **Cost Savings**: Smaller files reduce storage costs
4. **Better UX**: Faster upload and display times

## Troubleshooting

### Common Issues

1. **Upload Fails**: Check `BLOB_READ_WRITE_TOKEN` environment variable
2. **Images Not Loading**: Verify private access URLs are properly generated
3. **Cleanup Not Working**: Check database connection and permissions
4. **Large File Errors**: Adjust `MAX_FILE_SIZE` in configuration

### Debug Mode

Enable debug logging by setting `NODE_ENV=development` to see detailed optimization and upload logs.
