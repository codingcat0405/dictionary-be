import { Elysia, t } from "elysia";

const uploadController = new Elysia()
  .group("/upload", group =>
    group
      .post("/", async ({ body }) => {
        const file = body.file
        //write file to public/uploads
        const [name, extension] = file.name.split('.')
        const filePath = `public/uploads/${new Date().getTime()}.${extension}`
        await Bun.write(filePath, file)
        return {
          message: "File uploaded successfully",
          filePath,
        }
      }, {
        body: t.Object({
          file: t.File({ format: 'image/*' }),
        }),
        detail: {
          tags: ["Upload"],
        },
      })
  )

export default uploadController