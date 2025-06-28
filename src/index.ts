import { Elysia } from "elysia";
import "reflect-metadata"
import { AppDataSource } from "./data-source";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import errorMiddleware from "./middleware/errorMiddleware";
import responseMiddleware from "./middleware/responseMiddleware";
import userController from "./controller/userController";


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
  .onAfterHandle(responseMiddleware)
  .onError(errorMiddleware)
  .group("/api", group => {
    return group
    .use(userController)
  })
  .listen(3000);

console.log(`🦊 Elysia is running on ${app.server?.url}`);
console.log(`🚀 Swagger is running on ${app.server?.url}swagger-ui`);

