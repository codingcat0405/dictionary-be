import {Elysia, t} from "elysia";
import UserService from "../service/UserService";
import authMacro from "../macro/auth";
const userService = new UserService()
const userController = new Elysia()
  .group("/users", group =>
    group
      .use(authMacro)
      .post("/register", async ({body}) => {
        return await userService.register(body)
      }, {
        detail: {
          tags: ["User"],
        },
        body: t.Object({
          username: t.String(),
          password: t.String(),
          fullName: t.String(),
        })
      })
      .post("/login", async ({body}) => {
        return await userService.login(body)
      }, {
        detail: {
          tags: ["User"],
        },
        body: t.Object({
          username: t.String(),
          password: t.String(),
        })
      })
      .get("/me", async ({user}) => {
        return user
      }, {
        checkAuth: ['user'],
        detail: {
          tags: ["User"],
          security: [
            {JwtAuth: []}
          ],
        },
      })
      // .use(authMacro)
      .get("/admin", async ({user}) => {
        return user
      }, {
        checkAuth: ['admin'],
        detail: {
          tags: ["User"],
          security: [
            {JwtAuth: []}
          ],
        },
      })

  )

export default userController