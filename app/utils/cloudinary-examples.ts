/**
 * Cloudinary Utility Usage Examples
 *
 * This file demonstrates how to use the Cloudinary utility functions
 * in your SupaNuxt application for server-side file uploads.
 */

import {
  uploadFile,
  uploadImage,
  uploadVideo,
  uploadMultipleFiles,
  uploadFromUrl,
  deleteAsset,
  getAssetDetails,
  generateTransformedUrl,
  searchAssets,
  transformationPresets,
} from "./cloudinary";

// Define UploadOptions interface locally since it's not exported
interface UploadOptions {
  folder?: string;
  public_id?: string;
  resource_type?: "image" | "video" | "raw" | "auto";
  format?: string;
  quality?: string | number;
  width?: number;
  height?: number;
  crop?: string;
  gravity?: string;
  tags?: string[];
  context?: Record<string, string>;
  transformation?: any[];
  overwrite?: boolean;
  invalidate?: boolean;
  notification_url?: string;
}

// Example 1: Basic File Upload
export const exampleBasicUpload = async () => {
  console.log("=== Basic File Upload Example ===");

  try {
    // Upload from file path
    const result = await uploadFile("./path/to/your/image.jpg", {
      folder: "uploads",
      tags: ["example", "test"],
    });

    if (result.success) {
      console.log("Upload successful!", {
        publicId: result.data?.public_id,
        url: result.data?.secure_url,
        format: result.data?.format,
      });
    } else {
      console.error("Upload failed:", result.error);
    }
  } catch (error) {
    console.error("Upload error:", error);
  }
};

// Example 2: Image Upload with Transformations
export const exampleImageUploadWithTransformations = async () => {
  console.log("=== Image Upload with Transformations Example ===");

  try {
    const result = await uploadImage(
      "./path/to/profile-photo.jpg",
      transformationPresets.avatar, // Use predefined avatar transformation
      {
        folder: "avatars",
        public_id: "user_123_avatar",
        tags: ["profile", "avatar"],
      }
    );

    if (result.success) {
      console.log("Avatar upload successful!", {
        publicId: result.data?.public_id,
        secureUrl: result.data?.secure_url,
        width: result.data?.width,
        height: result.data?.height,
      });
    }
  } catch (error) {
    console.error("Avatar upload error:", error);
  }
};

// Example 3: Video Upload
export const exampleVideoUpload = async () => {
  console.log("=== Video Upload Example ===");

  try {
    const videoTransformations = [{ quality: "auto" }, { format: "mp4" }];

    const result = await uploadVideo(
      "./path/to/video.mp4",
      videoTransformations,
      {
        folder: "videos",
        public_id: "tutorial_video",
        tags: ["tutorial", "educational"],
      }
    );

    if (result.success) {
      console.log("Video upload successful!", {
        publicId: result.data?.public_id,
        secureUrl: result.data?.secure_url,
        duration: result.data?.duration,
        format: result.data?.format,
      });
    }
  } catch (error) {
    console.error("Video upload error:", error);
  }
};

// Example 4: Multiple File Upload
export const exampleMultipleFileUpload = async () => {
  console.log("=== Multiple File Upload Example ===");

  try {
    const files = [
      "./path/to/image1.jpg",
      "./path/to/image2.png",
      "./path/to/image3.gif",
    ];

    const results = await uploadMultipleFiles(files, {
      folder: "gallery",
      tags: ["gallery", "collection"],
    });

    results.forEach((result, index) => {
      if (result.success) {
        console.log(`File ${index + 1} uploaded successfully:`, {
          publicId: result.data?.public_id,
          url: result.data?.secure_url,
        });
      } else {
        console.error(`File ${index + 1} upload failed:`, result.error);
      }
    });
  } catch (error) {
    console.error("Multiple upload error:", error);
  }
};

// Example 5: Upload from URL
export const exampleUploadFromUrl = async () => {
  console.log("=== Upload from URL Example ===");

  try {
    const result = await uploadFromUrl("https://example.com/image.jpg", {
      folder: "remote-uploads",
      public_id: "remote_image",
      tags: ["remote", "external"],
    });

    if (result.success) {
      console.log("URL upload successful!", {
        publicId: result.data?.public_id,
        secureUrl: result.data?.secure_url,
      });
    }
  } catch (error) {
    console.error("URL upload error:", error);
  }
};

// Example 6: Asset Management
export const exampleAssetManagement = async () => {
  console.log("=== Asset Management Example ===");

  try {
    const publicId = "uploads/sample_image";

    // Get asset details
    const detailsResult = await getAssetDetails(publicId);
    if (detailsResult.success) {
      console.log("Asset details:", detailsResult.data);
    }

    // Generate transformed URL
    const transformedUrl = generateTransformedUrl(publicId, [
      { width: 300, height: 300, crop: "fill" },
      { quality: "auto" },
    ]);
    console.log("Transformed URL:", transformedUrl);

    // Delete asset (use with caution!)
    // const deleteResult = await deleteAsset(publicId)
    // if (deleteResult.success) {
    //   console.log('Asset deleted successfully')
    // }
  } catch (error) {
    console.error("Asset management error:", error);
  }
};

// Example 7: Search Assets
export const exampleSearchAssets = async () => {
  console.log("=== Search Assets Example ===");

  try {
    const result = await searchAssets("tags:gallery AND folder:uploads");

    if (result.success) {
      console.log("Search results:", result.data);
      console.log(`Found ${result.data?.resources?.length || 0} assets`);
    }
  } catch (error) {
    console.error("Search error:", error);
  }
};

// Example 8: Custom Upload Options
export const exampleCustomUploadOptions = async () => {
  console.log("=== Custom Upload Options Example ===");

  const customOptions: UploadOptions = {
    folder: "products",
    public_id: "product_456_main",
    resource_type: "image",
    format: "jpg",
    quality: 85,
    width: 800,
    height: 600,
    crop: "limit",
    tags: ["product", "main-image", "ecommerce"],
    context: {
      product_id: "456",
      category: "electronics",
      featured: "true",
    },
    overwrite: false,
    invalidate: true,
  };

  try {
    const result = await uploadFile(
      "./path/to/product-image.jpg",
      customOptions
    );

    if (result.success) {
      console.log("Custom upload successful!", {
        publicId: result.data?.public_id,
        secureUrl: result.data?.secure_url,
        width: result.data?.width,
        height: result.data?.height,
        bytes: result.data?.bytes,
      });
    }
  } catch (error) {
    console.error("Custom upload error:", error);
  }
};

// Example 9: Using with FormData (for file uploads from forms)
export const exampleFormDataUpload = async (formData: FormData) => {
  console.log("=== FormData Upload Example ===");

  try {
    // Extract file from FormData
    const file = formData.get("file") as File;
    if (!file) {
      throw new Error("No file provided in FormData");
    }

    // Convert File to Buffer or use directly
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    const result = await uploadImage(fileBuffer, transformationPresets.medium, {
      folder: "form-uploads",
      public_id: `form_${Date.now()}`,
      tags: ["form-upload"],
    });

    if (result.success) {
      console.log("FormData upload successful!", {
        publicId: result.data?.public_id,
        secureUrl: result.data?.secure_url,
      });
      return result;
    } else {
      console.error("FormData upload failed:", result.error);
      return result;
    }
  } catch (error) {
    console.error("FormData upload error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

// Example 10: Batch Processing with Error Handling
export const exampleBatchProcessing = async (files: string[]) => {
  console.log("=== Batch Processing Example ===");

  const results = [];

  for (const file of files) {
    try {
      console.log(`Processing: ${file}`);
      const result = await uploadFile(file, {
        folder: "batch",
        tags: ["batch-process"],
      });

      if (result.success) {
        console.log(`✓ ${file} uploaded successfully`);
        results.push({ file, success: true, data: result.data });
      } else {
        console.error(`✗ ${file} failed:`, result.error);
        results.push({ file, success: false, error: result.error });
      }
    } catch (error) {
      console.error(`✗ ${file} error:`, error);
      results.push({
        file,
        success: false,
        error: error instanceof Error ? error.message : String(error),
      });
    }

    // Small delay between uploads to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  const successCount = results.filter((r) => r.success).length;
  const failureCount = results.filter((r) => !r.success).length;

  console.log(
    `Batch complete: ${successCount} successful, ${failureCount} failed`
  );
  return results;
};

// Export all examples
export const examples = {
  basicUpload: exampleBasicUpload,
  imageUploadWithTransformations: exampleImageUploadWithTransformations,
  videoUpload: exampleVideoUpload,
  multipleFileUpload: exampleMultipleFileUpload,
  uploadFromUrl: exampleUploadFromUrl,
  assetManagement: exampleAssetManagement,
  searchAssets: exampleSearchAssets,
  customUploadOptions: exampleCustomUploadOptions,
  formDataUpload: exampleFormDataUpload,
  batchProcessing: exampleBatchProcessing,
};

export default examples;
