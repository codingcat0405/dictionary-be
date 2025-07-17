import { Elysia, t } from "elysia";
import ExerciseService from "../service/ExerciseService";
import authMacro from "../macro/auth";

const exerciseService = ExerciseService.getInstance();
const exerciseController = new Elysia()
  .group("/exercise", group =>
    group
      .use(authMacro)
      .post('/', async ({ body }) => {
        return await exerciseService.createExercise(body);
      }, {
        detail: {
          tags: ["Exercise"],
          security: [
            { JwtAuth: [] }
          ],
        },
        body: t.Object({
          name: t.String(),
          questions: t.Array(t.Object({
            question: t.String(),
            answerA: t.String(),
            answerB: t.String(),
            answerC: t.String(),
            answerD: t.String(),
            rightAnswer: t.Number(),
          })),
        }),
        checkAuth: ['admin'],
      })
      .put('/:id', async ({ params, body }) => {
        return await exerciseService.updateExercise(params.id, body);
      }, {
        detail: {
          tags: ["Exercise"],
          security: [
            { JwtAuth: [] }
          ],
        },
        body: t.Object({
          name: t.Optional(t.String()),
          questions: t.Optional(t.Array(t.Object({
            question: t.Optional(t.String()),
            answerA: t.Optional(t.String()),
            answerB: t.Optional(t.String()),
            answerC: t.Optional(t.String()),
            answerD: t.Optional(t.String()),
            rightAnswer: t.Optional(t.Number()),
          }))),
        }),
        params: t.Object({
          id: t.Number(),
        }),
        checkAuth: ['admin'],
      })
      .delete('/:id', async ({ params }) => {
        return await exerciseService.deleteExercise(+params.id);
      }, {
        detail: {
          tags: ["Exercise"],
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
        return await exerciseService.getExercise(+params.id);
      }, {
        detail: {
          tags: ["Exercise"],
          security: [
            { JwtAuth: [] }
          ],
        },
        checkAuth: [],
        params: t.Object({
          id: t.Number(),
        })
      })
      .post('/submit', async ({ body, user }) => {
        return await exerciseService.submitResult(body.exerciseId, user.id, body.result);
      }, {
        detail: {
          tags: ["Exercise"],
          security: [
            { JwtAuth: [] }
          ],
        },
        checkAuth: ['user'],
        body: t.Object({
          exerciseId: t.Number(),
          result: t.String(),
        })
      })
      .get('/user', async ({ user, query }) => {
        return await exerciseService.getUserExercises(user.id, query.page, query.limit);
      }, {
        detail: {
          tags: ["Exercise"],
          security: [
            { JwtAuth: [] }
          ],
        },
        checkAuth: ['user'],
        query: t.Object({
          page: t.Number(),
          limit: t.Number(),
        })
      })
      .get('/all', async ({ query }) => {
        return await exerciseService.getAllExercises(query.page, query.limit);
      }, {
        detail: {
          tags: ["Exercise"],
        },
        query: t.Object({
          page: t.Number(),
          limit: t.Number(),
        })
      })
      .get('/user/:id', async ({ params, user }) => {
        return await exerciseService.getUserExerciseResult(user.id, +params.id);
      }, {
        detail: {
          tags: ["Exercise"],
          security: [
            { JwtAuth: [] }
          ],
        },
        checkAuth: ['user'],
        params: t.Object({
          id: t.Number(),
        })
      })
      .get('/stats', async () => {
        return await exerciseService.getExerciseStats();
      }, {
        detail: {
          tags: ["Exercise"],
        },
      })
      .get('/:id/submissions', async ({ params }) => {
        return await exerciseService.getExerciseSubmissions(+params.id);
      }, {
        detail: {
          tags: ["Exercise"],
          security: [
            { JwtAuth: [] }
          ],
        },
        checkAuth: ['admin'],
        params: t.Object({
          id: t.Number(),
        })
      })
  )
export default exerciseController;