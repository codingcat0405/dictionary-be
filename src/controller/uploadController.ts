import { Elysia, t } from "elysia";
import UploadService from "../service/UploadService";
import authMacro from "../macro/auth";

const uploadService = new UploadService();

const uploadController = new Elysia()
  .group("/upload", (group) =>
    group
      .use(authMacro)
      // Upload single image
      .post(
        "/image",
        async ({ body, user }) => {
          const file = body.file;
          const result = await uploadService.uploadFile(file, {
            maxSize: 5 * 1024 * 1024, // 5MB
            allowedMimeTypes: [
              "image/jpeg",
              "image/jpg",
              "image/png",
              "image/gif",
              "image/webp",
            ],
            allowedExtensions: ["jpg", "jpeg", "png", "gif", "webp"],
          });

          if (!result.success) {
            throw new Error(result.error || "Upload failed");
          }

          return {
            success: true,
            url: result.url,
            fileName: result.fileName,
            fileSize: result.fileSize,
            mimeType: result.mimeType,
          };
        },
        {
          checkAuth: ["admin"],
          body: t.Object({
            file: t.File(),
          }),
          detail: {
            tags: ["Upload"],
            security: [{ JwtAuth: [] }],
            description: "Upload a single image file (max 5MB)",
          },
        }
      )
      // Upload multiple images
      .post(
        "/images",
        async ({ body, user, request }) => {
          // Handle both single file and multiple files from FormData
          // When multiple files are sent with the same key, they come as an array
          let files: File[] = [];

          const bodyAny = body as any;

          // Debug logging
          console.log("Upload images - body type:", typeof bodyAny);
          console.log("Upload images - body keys:", Object.keys(bodyAny || {}));
          console.log("Upload images - body.files:", bodyAny?.files);
          console.log("Upload images - body.file:", bodyAny?.file);

          if (bodyAny?.files) {
            files = Array.isArray(bodyAny.files) ? bodyAny.files : [bodyAny.files];
          } else if (bodyAny?.file) {
            // Fallback to single file key
            files = [bodyAny.file];
          }

          if (files.length === 0) {
            throw new Error("No files provided");
          }

          const results = await uploadService.uploadFiles(files, {
            maxSize: 5 * 1024 * 1024, // 5MB per file
            allowedMimeTypes: [
              "image/jpeg",
              "image/jpg",
              "image/png",
              "image/gif",
              "image/webp",
            ],
            allowedExtensions: ["jpg", "jpeg", "png", "gif", "webp"],
          });

          const successful = results.filter((r) => r.success);
          const failed = results.filter((r) => !r.success);

          return {
            success: successful.length > 0,
            urls: successful.map((r) => r.url),
            results: results.map((r) => ({
              success: r.success,
              url: r.url,
              fileName: r.fileName,
              error: r.error,
            })),
            errors: failed.map((r) => r.error).filter(Boolean),
          };
        },
        {
          checkAuth: ["admin"],
          body: t.Any(),
          detail: {
            tags: ["Upload"],
            security: [{ JwtAuth: [] }],
            description: "Upload multiple image files (max 5MB each). Send files in FormData with key 'files' (can be array)",
          },
        }
      )
      // Upload audio file
      .post(
        "/audio",
        async ({ body, user }) => {
          const file = body.file;
          const result = await uploadService.uploadFile(file, {
            maxSize: 10 * 1024 * 1024, // 10MB
            allowedMimeTypes: [
              "audio/mpeg",
              "audio/mp3",
              "audio/wav",
              "audio/ogg",
              "audio/mp4",
              "audio/aac",
            ],
            allowedExtensions: ["mp3", "wav", "ogg", "m4a", "aac"],
          });

          if (!result.success) {
            throw new Error(result.error || "Upload failed");
          }

          return {
            success: true,
            url: result.url,
            fileName: result.fileName,
            fileSize: result.fileSize,
            mimeType: result.mimeType,
          };
        },
        {
          checkAuth: ["admin"],
          body: t.Object({
            file: t.File(),
          }),
          detail: {
            tags: ["Upload"],
            security: [{ JwtAuth: [] }],
            description: "Upload an audio file (max 10MB)",
          },
        }
      )
      // Upload document file
      .post(
        "/document",
        async ({ body, user }) => {
          const file = body.file;
          const result = await uploadService.uploadFile(file, {
            maxSize: 50 * 1024 * 1024, // 50MB
            allowedMimeTypes: [
              "application/pdf",
              "application/msword",
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
              "text/plain",
              "application/rtf",
            ],
            allowedExtensions: ["pdf", "doc", "docx", "txt", "rtf"],
          });

          if (!result.success) {
            throw new Error(result.error || "Upload failed");
          }

          return {
            success: true,
            url: result.url,
            fileName: result.fileName,
            fileSize: result.fileSize,
            mimeType: result.mimeType,
          };
        },
        {
          checkAuth: ["admin"],
          body: t.Object({
            file: t.File(),
          }),
          detail: {
            tags: ["Upload"],
            security: [{ JwtAuth: [] }],
            description: "Upload a document file (max 50MB)",
          },
        }
      )
      // Delete file
      .delete(
        "/:fileName",
        async ({ params, user }) => {
          const fileName = params.fileName;
          const result = await uploadService.deleteFile(fileName);

          if (!result.success) {
            throw new Error(result.error || "Delete failed");
          }

          return {
            success: true,
            message: "File deleted successfully",
          };
        },
        {
          checkAuth: ["admin"],
          params: t.Object({
            fileName: t.String(),
          }),
          detail: {
            tags: ["Upload"],
            security: [{ JwtAuth: [] }],
            description: "Delete an uploaded file",
          },
        }
      )
  );

export default uploadController;