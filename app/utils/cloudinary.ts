import { v2 as cloudinary } from "cloudinary";

// Cloudinary configuration types
interface CloudinaryConfig {
  cloud_name: string;
  api_key: string;
  api_secret: string;
  secure?: boolean;
}

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
  [key: string]: any;
}

interface UploadResponse {
  success: boolean;
  data?: UploadResult;
  error?: string;
}

/**
 * Initialize Cloudinary configuration
 */
export const initializeCloudinary = (config?: CloudinaryConfig) => {
  try {
    // Use environment variables by default
    const cloudinaryConfig: CloudinaryConfig = config || {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
      api_key: process.env.CLOUDINARY_API_KEY || "",
      api_secret: process.env.CLOUDINARY_API_SECRET || "",
      secure: true,
    };

    if (
      !cloudinaryConfig.cloud_name ||
      !cloudinaryConfig.api_key ||
      !cloudinaryConfig.api_secret
    ) {
      throw new Error(
        "Cloudinary credentials are missing. Please check your environment variables."
      );
    }

    cloudinary.config(cloudinaryConfig);
    return true;
  } catch (error) {
    console.error("Failed to initialize Cloudinary:", error);
    return false;
  }
};

/**
 * Upload a single file to Cloudinary
 */
export const uploadFile = async (
  file: string | Buffer | any,
  options: UploadOptions = {}
): Promise<UploadResponse> => {
  try {
    // Initialize Cloudinary if not already done
    if (!cloudinary.config().cloud_name) {
      initializeCloudinary();
    }

    const uploadOptions = {
      resource_type: "auto" as const,
      use_filename: true,
      unique_filename: false,
      overwrite: true,
      ...options,
    };

    const result = await cloudinary.uploader.upload(file, uploadOptions);

    return {
      success: true,
      data: result,
    };
  } catch (error: any) {
    console.error("Upload failed:", error);
    return {
      success: false,
      error: error.message || "Upload failed",
    };
  }
};

/**
 * Upload multiple files to Cloudinary
 */
export const uploadMultipleFiles = async (
  files: (string | Buffer | any)[],
  options: UploadOptions = {}
): Promise<UploadResponse[]> => {
  try {
    const uploadPromises = files.map((file) => uploadFile(file, options));
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error: any) {
    console.error("Multiple upload failed:", error);
    return [
      {
        success: false,
        error: error.message || "Multiple upload failed",
      },
    ];
  }
};

/**
 * Upload image with specific transformations
 */
export const uploadImage = async (
  file: string | Buffer | any,
  transformations?: any[],
  options: UploadOptions = {}
): Promise<UploadResponse> => {
  try {
    const uploadOptions = {
      resource_type: "image" as const,
      transformation: transformations,
      ...options,
    };

    return await uploadFile(file, uploadOptions);
  } catch (error: any) {
    console.error("Image upload failed:", error);
    return {
      success: false,
      error: error.message || "Image upload failed",
    };
  }
};

/**
 * Upload video with specific transformations
 */
export const uploadVideo = async (
  file: string | Buffer | any,
  transformations?: any[],
  options: UploadOptions = {}
): Promise<UploadResponse> => {
  try {
    const uploadOptions = {
      resource_type: "video" as const,
      transformation: transformations,
      ...options,
    };

    return await uploadFile(file, uploadOptions);
  } catch (error: any) {
    console.error("Video upload failed:", error);
    return {
      success: false,
      error: error.message || "Video upload failed",
    };
  }
};

/**
 * Delete an asset from Cloudinary
 */
export const deleteAsset = async (
  publicId: string,
  resourceType: "image" | "video" | "raw" = "image"
): Promise<{ success: boolean; error?: string }> => {
  try {
    if (!cloudinary.config().cloud_name) {
      initializeCloudinary();
    }

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });

    return {
      success: result.result === "ok",
    };
  } catch (error: any) {
    console.error("Delete failed:", error);
    return {
      success: false,
      error: error.message || "Delete failed",
    };
  }
};

/**
 * Get asset details
 */
export const getAssetDetails = async (
  publicId: string,
  resourceType: "image" | "video" | "raw" = "image"
): Promise<{ success: boolean; data?: any; error?: string }> => {
  try {
    if (!cloudinary.config().cloud_name) {
      initializeCloudinary();
    }

    const result = await cloudinary.api.resource(publicId, {
      resource_type: resourceType,
    });

    return {
      success: true,
      data: result,
    };
  } catch (error: any) {
    console.error("Get asset details failed:", error);
    return {
      success: false,
      error: error.message || "Get asset details failed",
    };
  }
};

/**
 * Generate transformation URL without uploading
 */
export const generateTransformedUrl = (
  publicId: string,
  transformations: any[] = []
): string => {
  try {
    if (!cloudinary.config().cloud_name) {
      initializeCloudinary();
    }

    return cloudinary.url(publicId, {
      transformation: transformations,
      secure: true,
    });
  } catch (error: any) {
    console.error("Generate URL failed:", error);
    return "";
  }
};

/**
 * Upload from URL (remote file)
 */
export const uploadFromUrl = async (
  url: string,
  options: UploadOptions = {}
): Promise<UploadResponse> => {
  try {
    return await uploadFile(url, options);
  } catch (error: any) {
    console.error("URL upload failed:", error);
    return {
      success: false,
      error: error.message || "URL upload failed",
    };
  }
};

/**
 * Search for assets
 */
export const searchAssets = async (
  query: string,
  options: any = {}
): Promise<{ success: boolean; data?: any; error?: string }> => {
  try {
    if (!cloudinary.config().cloud_name) {
      initializeCloudinary();
    }

    const result = await cloudinary.search
      .expression(query)
      .with_field("tags")
      .with_field("context")
      .max_results(50)
      .execute();

    return {
      success: true,
      data: result,
    };
  } catch (error: any) {
    console.error("Search failed:", error);
    return {
      success: false,
      error: error.message || "Search failed",
    };
  }
};

// Common transformation presets
export const transformationPresets = {
  // Image transformations
  thumbnail: [
    { width: 200, height: 200, crop: "fill", gravity: "face" },
    { quality: "auto", fetch_format: "auto" },
  ],
  medium: [
    { width: 500, height: 500, crop: "limit" },
    { quality: "auto", fetch_format: "auto" },
  ],
  large: [
    { width: 1000, height: 1000, crop: "limit" },
    { quality: "auto", fetch_format: "auto" },
  ],

  // Avatar/Profile image
  avatar: [
    { width: 150, height: 150, crop: "fill", gravity: "face" },
    { radius: "max" },
    { quality: "auto", fetch_format: "auto" },
  ],

  // Cover image
  cover: [
    { width: 1200, height: 400, crop: "fill", gravity: "center" },
    { quality: "auto", fetch_format: "auto" },
  ],
};

// Initialize Cloudinary on module load
initializeCloudinary();

export default {
  initializeCloudinary,
  uploadFile,
  uploadMultipleFiles,
  uploadImage,
  uploadVideo,
  deleteAsset,
  getAssetDetails,
  generateTransformedUrl,
  uploadFromUrl,
  searchAssets,
  transformationPresets,
};
