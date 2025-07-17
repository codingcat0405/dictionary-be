import { getRepositories } from "../data-source";

class ExerciseService {
  private static instance: ExerciseService;
  private readonly repositories = getRepositories();
  private constructor() { }

  public static getInstance(): ExerciseService {
    if (!ExerciseService.instance) {
      ExerciseService.instance = new ExerciseService();
    }
    return ExerciseService.instance;
  }

  async createExercise(data: {
    name: string;
    questions: {
      question: string;
      answerA: string;
      answerB: string;
      answerC: string;
      answerD: string;
      rightAnswer: number
    }[];
  }) {
    const exercise = this.repositories.exercise.create({
      name: data.name,
    });
    const exerciseCreated = await this.repositories.exercise.save(exercise);
    const exerciseQuestions = data.questions.map((question) => {
      return this.repositories.exerciseQuestion.create({
        ...question,
        exerciseId: exerciseCreated.id,
      });
    });
    await this.repositories.exerciseQuestion.save(exerciseQuestions);
    return exerciseCreated;
  }

  async updateExercise(id: number, data: {
    name?: string;
    questions?: {
      question?: string;
      answerA?: string;
      answerB?: string;
      answerC?: string;
      answerD?: string;
      rightAnswer?: number;
    }[];
  }) {
    const exercise = await this.repositories.exercise.findOne({ where: { id } });
    if (!exercise) {
      throw new Error('Exercise not found');
    }
    if (data.name) {
      exercise.name = data.name;
    }
    await this.repositories.exercise.save(exercise);
    //delete old questions
    await this.repositories.exerciseQuestion.delete({ exerciseId: id });
    //create new questions
    const exerciseQuestions = data.questions?.map((question) => {
      return this.repositories.exerciseQuestion.create({
        ...question,
        exerciseId: exercise.id,
      });
    });
    await this.repositories.exerciseQuestion.save(exerciseQuestions ?? []);
    return exercise;
  }

  async deleteExercise(id: number) {
    const exercise = await this.repositories.exercise.findOne({ where: { id } });
    if (!exercise) {
      throw new Error('Exercise not found');
    }
    return await this.repositories.exercise.softDelete(id);
  }

  async getExercise(id: number) {
    return await this.repositories.exercise.findOneOrFail({ where: { id }, relations: ['questions'] });
  }

  async submitResult(exerciseId: number, userId: number, result: string) {
    const exercise = await this.repositories.exercise.findOne({ where: { id: exerciseId }, relations: ['questions'] });
    if (!exercise) {
      throw new Error('Exercise not found');
    }
    const user = await this.repositories.user.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }
    const userSubmitResult: { questionId: number, answer: number }[] = JSON.parse(result);
    //calculate score
    let rightAnswers = 0;
    for (const question of exercise.questions) {
      const userSubmitAnswer = userSubmitResult.find((item) => item.questionId === question.id);
      if (userSubmitAnswer && userSubmitAnswer.answer === question.rightAnswer) {
        rightAnswers++;
      }
    }
    const userExerciseResult = await this.repositories.userExerciseResult.findOne({ where: { exerciseId, userId } });
    if (!userExerciseResult) {
      //create new
      const userExerciseResult = await this.repositories.userExerciseResult.create({
        exerciseId,
        userId,
        result,
        score: rightAnswers
      })
      return await this.repositories.userExerciseResult.save(userExerciseResult);
    }
    //user resubmit update result
    userExerciseResult.result = result;
    userExerciseResult.score = rightAnswers;
    return await this.repositories.userExerciseResult.save(userExerciseResult);
  }

  async getUserExercises(userId: number, page: number, limit: number) {
    const [userExerciseResults, total] = await this.repositories.userExerciseResult.findAndCount({
      where: { userId },
      relations: ['exercise'],
      skip: page * limit,
      take: limit
    });
    return { content: userExerciseResults, total, page, limit };
  }

  async getAllExercises(page: number, limit: number) {
    const [exercises, total] = await this.repositories.exercise.findAndCount({
      relations: ['questions'],
      skip: page * limit,
      take: limit,
      order: {
        createdAt: 'DESC'
      }
    });
    return { contents: exercises, total, page, limit };
  }



  async getUserExerciseResult(userId: number, exerciseId: number) {
    return await this.repositories.userExerciseResult.findOneOrFail({
      where: { userId, exerciseId },
      relations: ['exercise', 'exercise.questions']
    });
  }

  async getExerciseStats() {
    // Get all exercises with their user exercise results
    const exercises = await this.repositories.exercise.find({
      relations: ['userExerciseResults']
    });

    // Calculate stats for each exercise
    const exerciseStats = exercises.map(exercise => ({
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      submissionCount: exercise.userExerciseResults.length
    }));

    // Calculate totals
    const totalExercises = exercises.length;
    const totalSubmissions = exercises.reduce((sum, exercise) =>
      sum + exercise.userExerciseResults.length, 0
    );

    return {
      totalExercises,
      totalSubmissions,
      exerciseStats
    };
  }
  async getExerciseSubmissions(exerciseId: number) {
    const submissions = await this.repositories.userExerciseResult.find({
      where: { exerciseId },
      relations: ['user'],
      order: {
        createdAt: 'DESC'
      }
    });

    return {
      submissions: submissions.map(submission => ({
        id: submission.id,
        userId: submission.userId,
        exerciseId: submission.exerciseId,
        result: submission.result,
        score: submission.score,
        createdAt: submission.createdAt,
        updatedAt: submission.updatedAt,
        user: {
          id: submission.user.id,
          username: submission.user.username,
          fullName: submission.user.fullName
        }
      })),
      total: submissions.length
    };
  }
}

export default ExerciseService;