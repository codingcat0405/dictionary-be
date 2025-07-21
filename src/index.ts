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
import { networkInterfaces } from 'os';
import path from "path";
import { mkdirSync } from "fs";

//create /public/uploads if not exists
const publicDir = path.join(process.cwd(), 'public')
mkdirSync(publicDir, { recursive: true })

AppDataSource.initialize().then(() => {
  console.log("Database connected")
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
  .use(staticPlugin())

  .group("/api", group => {
    return group
      .onAfterHandle(responseMiddleware)
      .onError(errorMiddleware)
      .use(userController)
      .use(uploadController)
      .use(dictionaryController)
      .use(exerciseController)
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

