import { Elysia, t } from "elysia";
import DictionaryService from "../service/DictionaryService";
import authMacro from "../macro/auth";

const dictionaryService = DictionaryService.getInstance();
const dictionaryController = new Elysia()
  .group("/dictionary", group =>
    group
    .use(authMacro)
    .post('/', async ({body}) => {
      return await dictionaryService.createDictionary(body);
    }, {
      detail: {
        tags: ["Dictionary"],
        security: [
          {JwtAuth: []}
        ],
      },
      body: t.Object({
        word: t.String(),
        pronunciation: t.Optional(t.String()),
        definition: t.String(),
        images: t.Optional(t.String()),
        type: t.Number(),
      }),
      checkAuth: ['admin'],
    })
    .put('/:id', async ({params, body}) => {
      return await dictionaryService.updateDictionary(+params.id, body);
    }, {
      detail: {
        tags: ["Dictionary"],
        security: [
          {JwtAuth: []}
        ],
      },
      body: t.Object({
        word: t.Optional(t.String()),
        pronunciation: t.Optional(t.String()),
        definition: t.Optional(t.String()),
        images: t.Optional(t.String()),
        type: t.Optional(t.Number()),
      }),
      params: t.Object({
        id: t.String(),
      }),
      checkAuth: ['admin'],
    })
    .delete('/:id', async ({params}) => {
      return await dictionaryService.deleteDictionary(+params.id);
    }, {
      detail: {
        tags: ["Dictionary"],
        security: [
          {JwtAuth: []}
        ],
      },
      params: t.Object({
        id: t.String(),
      }),
      checkAuth: ['admin'],
    })
    .get('/:id', async ({params}) => {
      return await dictionaryService.getDictionary(+params.id);
    }, {
      detail: {
        tags: ["Dictionary"],
      },
      params: t.Object({
        id: t.String(),
      }),
    })
    .get('/', async ({query}) => {
      return await dictionaryService.findWords(query.word, +query.type);
    }, {
      detail: {
        tags: ["Dictionary"],
      },
      query: t.Object({
        word: t.String(),
        type: t.String(),
      }),
    })
    .get('/all', async ({query}) => {
      return await dictionaryService.getAllWords(query.page, query.limit);
    }, {
      detail: {
        tags: ["Dictionary"],
      },
      query: t.Object({
        page: t.Number(),
        limit: t.Number(),
      }),
    })
    .get('/count', async () => {
      return await dictionaryService.count();
    }, {
      detail: {
        tags: ["Dictionary"],
      },
    })
  )

export default dictionaryController;