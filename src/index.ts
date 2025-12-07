import { Elysia } from "elysia";
import "reflect-metadata"
import { AppDataSource } from "./data-source";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import errorMiddleware from "./middleware/errorMiddleware";
import responseMiddleware from "./middleware/responseMiddleware";
import userController from "./controller/userController";
import { staticPlugin } from "@elysiajs/static";
import uploadController from "./controller/uploadController";
import dictionaryController from "./controller/dictionaryController";
import exerciseController from "./controller/exerciseController";
import curriculumController from "./controller/curriculumController";
import { networkInterfaces } from 'os';
import path from "path";
import { mkdirSync } from "fs";

//create /public/uploads if not exists
const publicDir = path.join(process.cwd(), 'public')
const uploadsDir = path.join(publicDir, 'uploads')
mkdirSync(publicDir, { recursive: true })
mkdirSync(uploadsDir, { recursive: true })

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected")
  })
  .catch((error) => {
    console.error("Database connection error:", error)
  })

const app = new Elysia()
  .use(cors())
  .get("/", () => "It's works!")
  .use(swagger(
    {
      path: '/swagger-ui',
      provider: 'swagger-ui',
      documentation: {
        info: {
          title: 'Elysia template v3',
          description: 'Elysia template API Documentation',
          version: '1.0.3',
        },
        components: {
          securitySchemes: {
            JwtAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT',
              description: 'Enter JWT Bearer token **_only_**'
            }
          }
        },
      },
      swaggerOptions: {
        persistAuthorization: true,
      }
    }
  ))
  // Custom route handler for uploaded files (before /api group to avoid middleware)
  // This ensures files are served correctly without middleware interference
  .get("/public/uploads/*", ({ params, set }) => {
    const { readFileSync, existsSync } = require("fs");
    const fileName = params["*"];
    const filePath = path.join(process.cwd(), "public", "uploads", fileName);

    // Add CORS headers
    set.headers['Access-Control-Allow-Origin'] = '*';
    set.headers['Access-Control-Allow-Methods'] = 'GET, OPTIONS';
    set.headers['Access-Control-Allow-Headers'] = 'Content-Type';

    if (existsSync(filePath)) {
      const file = readFileSync(filePath);
      const ext = path.extname(filePath).slice(1).toLowerCase();
      const contentType: { [key: string]: string } = {
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'png': 'image/png',
        'gif': 'image/gif',
        'webp': 'image/webp',
        'mp3': 'audio/mpeg',
        'wav': 'audio/wav',
        'ogg': 'audio/ogg',
        'm4a': 'audio/mp4',
        'aac': 'audio/aac',
        'pdf': 'application/pdf',
        'doc': 'application/msword',
        'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'txt': 'text/plain',
        'rtf': 'application/rtf'
      };
      set.headers['Content-Type'] = contentType[ext] || 'application/octet-stream';
      set.headers['Cache-Control'] = 'public, max-age=31536000';
      return file;
    }
    set.status = 404;
    return "File not found";
  })
  // Use Elysia static plugin for other public files (optional, for future use)
  .use(staticPlugin({
    assets: "public",
    prefix: "/public",
    ignorePatterns: ["uploads/**"], // Ignore uploads folder as we handle it above
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=31536000'
    }
  }))

  .group("/api", group => {
    return group
      .onAfterHandle(responseMiddleware)
      .onError(errorMiddleware)
      .use(userController)
      .use(uploadController)
      .use(dictionaryController)
      .use(exerciseController)
      .use(curriculumController)
  })
  .listen(3000);


function getLocalIP() {
  const nets = networkInterfaces();
  for (const name of Object.keys(nets)) {
    const interfaces = nets[name];
    if (interfaces) {
      for (const netInterface of interfaces) {
        // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
        if (netInterface.family === 'IPv4' && !netInterface.internal) {
          return netInterface.address;
        }
      }
    }
  }
  return 'localhost';
}

const serverIP = getLocalIP();
console.log(`🌐 Server IP: ${serverIP}`);
console.log(`🚀 Use this IP to configure your desktop app`);

