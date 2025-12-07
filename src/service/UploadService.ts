import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

interface UploadResult {
  success: boolean;
  url: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  error?: string;
}

interface UploadOptions {
  maxSize?: number; // in bytes
  allowedMimeTypes?: string[];
  allowedExtensions?: string[];
}

class UploadService {
  private readonly uploadsDir: string;
  private readonly maxFileSize: number = 10 * 1024 * 1024; // 10MB default

  constructor() {
    this.uploadsDir = path.join(process.cwd(), "public", "uploads");
    this.ensureUploadsDirectory();
  }

  private async ensureUploadsDirectory(): Promise<void> {
    if (!existsSync(this.uploadsDir)) {
      await mkdir(this.uploadsDir, { recursive: true });
    }
  }

  /**
   * Sanitize filename to prevent path traversal and special characters
   */
  private sanitizeFileName(fileName: string): string {
    // Get only the basename to prevent path traversal
    const basename = path.basename(fileName);
    // Remove any special characters except dots, hyphens, and underscores
    const sanitized = basename.replace(/[^a-zA-Z0-9._-]/g, "_");
    // Generate unique filename with timestamp and random string
    const ext = path.extname(sanitized);
    const nameWithoutExt = path.basename(sanitized, ext);
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 9);
    return `${timestamp}_${randomStr}_${nameWithoutExt}${ext}`;
  }

  /**
   * Validate file based on size, MIME type, and extension
   */
  private validateFile(
    file: File,
    options: UploadOptions = {}
  ): { valid: boolean; error?: string } {
    // Check file size
    const maxSize = options.maxSize || this.maxFileSize;
    if (file.size > maxSize) {
      return {
        valid: false,
        error: `File size exceeds maximum allowed size of ${maxSize / 1024 / 1024}MB`,
      };
    }

    if (file.size === 0) {
      return {
        valid: false,
        error: "File is empty",
      };
    }

    // Check MIME type if specified
    if (options.allowedMimeTypes && options.allowedMimeTypes.length > 0) {
      if (!options.allowedMimeTypes.includes(file.type)) {
        return {
          valid: false,
          error: `File type ${file.type} is not allowed. Allowed types: ${options.allowedMimeTypes.join(", ")}`,
        };
      }
    }

    // Check extension if specified
    if (options.allowedExtensions && options.allowedExtensions.length > 0) {
      const ext = path.extname(file.name).slice(1).toLowerCase();
      if (!options.allowedExtensions.includes(ext)) {
        return {
          valid: false,
          error: `File extension .${ext} is not allowed. Allowed extensions: ${options.allowedExtensions.join(", ")}`,
        };
      }
    }

    return { valid: true };
  }

  /**
   * Upload a file
   */
  async uploadFile(
    file: File,
    options: UploadOptions = {}
  ): Promise<UploadResult> {
    try {
      // Ensure uploads directory exists
      await this.ensureUploadsDirectory();

      // Validate file
      const validation = this.validateFile(file, options);
      if (!validation.valid) {
        return {
          success: false,
          url: "",
          fileName: "",
          fileSize: 0,
          mimeType: "",
          error: validation.error,
        };
      }

      // Sanitize filename
      const sanitizedFileName = this.sanitizeFileName(file.name);
      const filePath = path.join(this.uploadsDir, sanitizedFileName);

      // Convert File to Buffer and write
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      await writeFile(filePath, buffer);

      // Return URL path (will be served by static plugin at /public/uploads/filename)
      const url = `/public/uploads/${sanitizedFileName}`;

      return {
        success: true,
        url,
        fileName: file.name, // Original filename
        fileSize: file.size,
        mimeType: file.type,
      };
    } catch (error) {
      console.error("Upload error:", error);
      return {
        success: false,
        url: "",
        fileName: "",
        fileSize: 0,
        mimeType: "",
        error: error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  /**
   * Upload multiple files
   */
  async uploadFiles(
    files: File[],
    options: UploadOptions = {}
  ): Promise<UploadResult[]> {
    const results = await Promise.all(
      files.map((file) => this.uploadFile(file, options))
    );
    return results;
  }

  /**
   * Delete a file
   */
  async deleteFile(fileUrl: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Extract filename from URL
      const fileName = path.basename(fileUrl);
      const filePath = path.join(this.uploadsDir, fileName);

      if (!existsSync(filePath)) {
        return { success: false, error: "File not found" };
      }

      const { unlink } = await import("fs/promises");
      await unlink(filePath);

      return { success: true };
    } catch (error) {
      console.error("Delete file error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }
}

export default UploadService;

