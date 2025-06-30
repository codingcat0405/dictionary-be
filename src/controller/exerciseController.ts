import { Elysia } from "elysia";
import ExerciseService from "../service/ExerciseService";

const exerciseService = ExerciseService.getInstance();
const exerciseController = new Elysia()
  .group("/exercise", group =>
    group
  )

export default exerciseController;