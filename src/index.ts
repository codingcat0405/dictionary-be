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

console.log(`🦊 Elysia is running on ${app.server?.url}`);
console.log(`🚀 Swagger is running on ${app.server?.url}swagger-ui`);

