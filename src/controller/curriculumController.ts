import { Elysia, t } from "elysia";
import CurriculumService from "../service/CurriculumService";
import authMacro from "../macro/auth";

const curriculumService = CurriculumService.getInstance();
const curriculumController = new Elysia()
  .group("/curriculum", group =>
    group
      .use(authMacro)
      .post('/', async ({ body }) => {
        return await curriculumService.createCurriculum(body);
      }, {
        detail: {
          tags: ["Curriculum"],
          security: [
            { JwtAuth: [] }
          ],
        },
        body: t.Object({
          title: t.String(),
          description: t.Optional(t.String()),
          fileName: t.String(),
          fileUrl: t.String(),
          fileSize: t.Number(),
          mimeType: t.String(),
        }),
        checkAuth: ['admin'],
      })
      .put('/:id', async ({ params, body }) => {
        return await curriculumService.updateCurriculum(params.id, body);
      }, {
        detail: {
          tags: ["Curriculum"],
          security: [
            { JwtAuth: [] }
          ],
        },
        body: t.Object({
          title: t.Optional(t.String()),
          description: t.Optional(t.String()),
        }),
        params: t.Object({
          id: t.Number(),
        }),
        checkAuth: ['admin'],
      })
      .delete('/:id', async ({ params }) => {
        return await curriculumService.deleteCurriculum(+params.id);
      }, {
        detail: {
          tags: ["Curriculum"],
          security: [
            { JwtAuth: [] }
          ],
        },
        params: t.Object({
          id: t.Number(),
        }),
        checkAuth: ['admin'],
      })
      .get('/:id', async ({ params }) => {
        return await curriculumService.getCurriculum(+params.id);
      }, {
        detail: {
          tags: ["Curriculum"],
        },
        params: t.Object({
          id: t.Number(),
        })
      })
      .get('/', async ({ query }) => {
        return await curriculumService.getAllCurriculums(query.page, query.limit);
      }, {
        detail: {
          tags: ["Curriculum"],
        },
        query: t.Object({
          page: t.Number(),
          limit: t.Number(),
        })
      })
  )

export default curriculumController;
