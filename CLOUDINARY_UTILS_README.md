# Cloudinary Upload Utility for SupaNuxt

A comprehensive, TypeScript-ready Cloudinary utility for server-side file uploads in your SupaNuxt application. This utility provides a clean, easy-to-use interface for uploading images, videos, and other files to Cloudinary with advanced features like transformations, batch processing, and asset management.

## Features

- 🚀 **Easy File Upload**: Simple API for uploading single or multiple files
- 🖼️ **Image & Video Support**: Dedicated functions for different media types
- 🎨 **Transformations**: Built-in transformation presets and custom options
- 📁 **Folder Organization**: Organize uploads with custom folder structures
- 🔍 **Asset Management**: Search, retrieve details, and delete assets
- ⚡ **Batch Processing**: Handle multiple files efficiently with error handling
- 🛡️ **TypeScript Support**: Full TypeScript definitions for better development experience
- 🔧 **Error Handling**: Comprehensive error handling with detailed responses
- 🔗 **URL Generation**: Generate transformation URLs without uploading

## Installation

The Cloudinary SDK is already included in your project dependencies:

```bash
npm install cloudinary
```

## Environment Setup

Add your Cloudinary credentials to your `.env` file:

```bash
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_URL=cloudinary://your_api_key:your_api_secret@your_cloud_name
```

## Quick Start

### Basic File Upload

```typescript
import { uploadFile } from "~/utils/cloudinary";

// Upload a single file
const result = await uploadFile("./path/to/image.jpg", {
  folder: "uploads",
  tags: ["example", "test"],
});

if (result.success) {
  console.log("Upload successful:", result.data?.secure_url);
} else {
  console.error("Upload failed:", result.error);
}
```

### Image Upload with Transformations

```typescript
import { uploadImage, transformationPresets } from "~/utils/cloudinary";

// Upload with avatar transformation
const result = await uploadImage(
  "./path/to/profile-photo.jpg",
  transformationPresets.avatar,
  {
    folder: "avatars",
    public_id: "user_123_avatar",
    tags: ["profile", "avatar"],
  }
);
```

## API Reference

### Core Functions

#### `uploadFile(file, options?)`

Upload any file type to Cloudinary.

**Parameters:**

- `file`: File path, URL, or Buffer
- `options`: Upload options (see UploadOptions interface)

**Returns:** `Promise<UploadResponse>`

#### `uploadImage(file, transformations?, options?)`

Upload an image with optional transformations.

**Parameters:**

- `file`: Image file path, URL, or Buffer
- `transformations`: Array of transformation objects
- `options`: Upload options

**Returns:** `Promise<UploadResponse>`

#### `uploadVideo(file, transformations?, options?)`

Upload a video with optional transformations.

**Parameters:**

- `file`: Video file path, URL, or Buffer
- `transformations`: Array of transformation objects
- `options`: Upload options

**Returns:** `Promise<UploadResponse>`

#### `uploadMultipleFiles(files, options?)`

Upload multiple files at once.

**Parameters:**

- `files`: Array of file paths, URLs, or Buffers
- `options`: Upload options

**Returns:** `Promise<UploadResponse[]>`

### Asset Management

#### `deleteAsset(publicId, resourceType?)`

Delete an asset from Cloudinary.

**Parameters:**

- `publicId`: The public ID of the asset to delete
- `resourceType`: Type of asset ('image', 'video', 'raw')

**Returns:** `Promise<{success: boolean, error?: string}>`

#### `getAssetDetails(publicId, resourceType?)`

Get details of a specific asset.

**Parameters:**

- `publicId`: The public ID of the asset
- `resourceType`: Type of asset ('image', 'video', 'raw')

**Returns:** `Promise<{success: boolean, data?: any, error?: string}>`

#### `searchAssets(query, options?)`

Search for assets using Cloudinary's search API.

**Parameters:**

- `query`: Search expression (e.g., "tags:gallery AND folder:uploads")
- `options`: Additional search options

**Returns:** `Promise<{success: boolean, data?: any, error?: string}>`

### Utility Functions

#### `generateTransformedUrl(publicId, transformations?)`

Generate a transformation URL without uploading.

**Parameters:**

- `publicId`: The public ID of the asset
- `transformations`: Array of transformation objects

**Returns:** `string` - The transformed URL

#### `uploadFromUrl(url, options?)`

Upload a file from a remote URL.

**Parameters:**

- `url`: The remote file URL
- `options`: Upload options

**Returns:** `Promise<UploadResponse>`

### Upload Options

```typescript
interface UploadOptions {
  folder?: string; // Folder to organize uploads
  public_id?: string; // Custom public ID for the asset
  resource_type?: "image" | "video" | "raw" | "auto";
  format?: string; // Force a specific format
  quality?: string | number; // Image quality setting
  width?: number; // Image width
  height?: number; // Image height
  crop?: string; // Crop mode
  gravity?: string; // Gravity for cropping
  tags?: string[]; // Tags for organization
  context?: Record<string, string>; // Contextual metadata
  transformation?: any[]; // Custom transformations
  overwrite?: boolean; // Overwrite existing assets
  invalidate?: boolean; // Invalidate cached versions
  notification_url?: string; // Webhook for upload notifications
}
```

### Transformation Presets

Pre-defined transformation presets for common use cases:

```typescript
transformationPresets.thumbnail; // 200x200 face-cropped thumbnail
transformationPresets.medium; // 500x500 limited size image
transformationPresets.large; // 1000x1000 limited size image
transformationPresets.avatar; // 150x150 circular face-cropped avatar
transformationPresets.cover; // 1200x400 centered cover image
```

## Usage Examples

### Form Data Upload (Server-side)

```typescript
import { uploadImage } from "~/utils/cloudinary";
import type { H3Event } from "h3";

export default defineEventHandler(async (event: H3Event) => {
  const formData = await readMultipartFormData(event);
  const file = formData?.find((f) => f.name === "file");

  if (!file || !file.data) {
    throw createError({
      statusCode: 400,
      statusMessage: "No file provided",
    });
  }

  const result = await uploadImage(file.data, transformationPresets.medium, {
    folder: "uploads",
    public_id: `upload_${Date.now()}`,
    tags: ["form-upload"],
  });

  if (!result.success) {
    throw createError({
      statusCode: 500,
      statusMessage: result.error,
    });
  }

  return {
    success: true,
    data: result.data,
  };
});
```

### Batch Upload with Error Handling

```typescript
import { uploadMultipleFiles } from "~/utils/cloudinary";

export const uploadBatch = async (filePaths: string[]) => {
  const results = await uploadMultipleFiles(filePaths, {
    folder: "batch",
    tags: ["batch-upload"],
  });

  const successful = results.filter((r) => r.success);
  const failed = results.filter((r) => !r.success);

  return {
    total: results.length,
    successful: successful.length,
    failed: failed.length,
    results,
  };
};
```

### Generate Responsive Images

```typescript
import { generateTransformedUrl } from "~/utils/cloudinary";

export const getResponsiveImageUrls = (publicId: string) => {
  const baseTransformations = [{ quality: "auto", fetch_format: "auto" }];

  return {
    thumbnail: generateTransformedUrl(publicId, [
      ...baseTransformations,
      { width: 150, height: 150, crop: "fill" },
    ]),
    medium: generateTransformedUrl(publicId, [
      ...baseTransformations,
      { width: 500, crop: "limit" },
    ]),
    large: generateTransformedUrl(publicId, [
      ...baseTransformations,
      { width: 1000, crop: "limit" },
    ]),
  };
};
```

### Video Upload with Custom Transformations

```typescript
import { uploadVideo } from "~/utils/cloudinary";

export const uploadVideoWithThumbnails = async (videoPath: string) => {
  const videoTransformations = [{ quality: "auto" }, { format: "mp4" }];

  const thumbnailTransformations = [
    { start_offset: "10%" },
    { width: 400, height: 300, crop: "fill" },
    { quality: "auto" },
  ];

  // Upload video
  const videoResult = await uploadVideo(videoPath, videoTransformations, {
    folder: "videos",
    tags: ["content", "tutorial"],
  });

  // Generate thumbnail URL (without uploading)
  const thumbnailUrl = videoResult.success
    ? generateTransformedUrl(
        videoResult.data!.public_id + ".jpg",
        thumbnailTransformations
      )
    : null;

  return {
    video: videoResult,
    thumbnail: thumbnailUrl,
  };
};
```

## Server-Side Usage in Nuxt

This utility is designed for **server-side only** usage in Nuxt applications. Here are the recommended patterns:

### API Routes

Create API routes in `server/api/` directory:

```typescript
// server/api/upload.post.ts
import { uploadImage } from "~/utils/cloudinary";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { imageData, folder = "uploads" } = body;

  if (!imageData) {
    throw createError({
      statusCode: 400,
      statusMessage: "Image data is required",
    });
  }

  const result = await uploadImage(imageData, undefined, {
    folder,
    tags: ["api-upload"],
  });

  return result;
});
```

### Server Middleware

Use in server middleware for automatic processing:

```typescript
// server/middleware/upload.ts
import { uploadImage } from "~/utils/cloudinary";

export default defineEventHandler(async (event) => {
  // Auto-upload images from specific requests
  if (event.path.startsWith("/api/auto-upload")) {
    const body = await readBody(event);
    if (body.autoUpload && body.imageData) {
      const result = await uploadImage(
        body.imageData,
        transformationPresets.medium,
        {
          folder: "auto-uploads",
        }
      );
      event.context.uploadResult = result;
    }
  }
});
```

## Error Handling

All functions return a consistent response format:

```typescript
interface UploadResponse {
  success: boolean;
  data?: UploadResult; // Present if success = true
  error?: string; // Present if success = false
}

interface UploadResult {
  public_id: string;
  version: number;
  signature: string;
  width?: number;
  height?: number;
  format: string;
  resource_type: string;
  created_at: string;
  bytes: number;
  type: string;
  url: string;
  secure_url: string;
  original_filename?: string;
  [key: string]: any; // Additional Cloudinary response data
}
```

## Security Best Practices

1. **Never expose API keys**: Keep your `CLOUDINARY_API_SECRET` server-side only
2. **Validate file types**: Check file types before uploading
3. **Set file size limits**: Implement appropriate file size restrictions
4. **Use folders for organization**: Organize uploads by user, project, etc.
5. **Implement authentication**: Ensure only authorized users can upload
6. **Sanitize filenames**: Clean up user-provided filenames
7. **Use transformations wisely**: Be mindful of transformation costs

## Advanced Features

### Custom Transformation Builder

```typescript
const customTransformations = [
  // Resize with face detection
  { width: 300, height: 300, crop: "fill", gravity: "face" },

  // Apply effects
  { effect: "brightness:10" },
  { effect: "contrast:15" },

  // Optimize
  { quality: "auto:good" },
  { fetch_format: "auto" },

  // Add overlay
  { overlay: "logo.png", gravity: "south_east", x: 10, y: 10, opacity: 80 },
];

const result = await uploadImage("./photo.jpg", customTransformations, {
  folder: "processed",
});
```

### Upload with Context and Metadata

```typescript
const result = await uploadImage("./document.pdf", undefined, {
  folder: "documents",
  context: {
    document_type: "contract",
    client_name: "Acme Corp",
    signed_date: "2024-01-15",
    confidential: "true",
  },
  tags: ["legal", "contract", "signed"],
});
```

## Troubleshooting

### Common Issues

1. **"Cloudinary credentials are missing"**

   - Check your `.env` file has the correct `CLOUDINARY_*` variables
   - Ensure the environment variables are loaded in your application

2. **"Upload failed"**

   - Check file path exists and is accessible
   - Verify file size is within Cloudinary limits
   - Ensure proper file permissions

3. **TypeScript errors**
   - Make sure you're importing the correct types
   - Check that all required environment variables are set

### Debug Mode

Enable debug logging by setting:

```typescript
process.env.NODE_ENV === "development" &&
  console.log("Cloudinary debug info...");
```

## Examples File

Check `app/utils/cloudinary-examples.ts` for comprehensive usage examples including:

- Basic uploads
- Image and video uploads with transformations
- Multiple file uploads
- Asset management operations
- FormData handling
- Batch processing with error handling
- Search functionality
- Custom upload options

## Support

For Cloudinary-specific issues:

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Cloudinary Support](https://support.cloudinary.com/)

For this utility:

- Check the examples file for implementation patterns
- Review the TypeScript interfaces for available options
- Test with the transformation presets before creating custom ones

---

**Note**: This utility is designed for server-side usage in Nuxt applications. For client-side uploads, consider using Cloudinary's Upload Widget or signed upload approaches.
