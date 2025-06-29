import "reflect-metadata"
import { DataSource, Repository } from "typeorm"
import { User } from "./entity/User"
import { Exercise } from "./entity/Exercise"
import { ExerciseQuestion } from "./entity/ExerciseQuestion"
import { Dictionary } from "./entity/Dictionary"
import { UserExerciseResult } from "./entity/UserExerciseResult"

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "database.sqlite",
    synchronize: true,
    logging: false,
    entities: [User, Exercise, ExerciseQuestion, Dictionary, UserExerciseResult],
    migrations: [],
    subscribers: [],
})

export interface Repositories {
    user: Repository<User>,
    exercise: Repository<Exercise>,
    exerciseQuestion: Repository<ExerciseQuestion>,
    dictionary: Repository<Dictionary>,
    userExerciseResult: Repository<UserExerciseResult>,
}

let cached: Repositories | null = null


export function getRepositories(): Repositories {
    if (cached) return cached
    const repositories: Repositories = {
        user: AppDataSource.getRepository(User),
        exercise: AppDataSource.getRepository(Exercise),
        exerciseQuestion: AppDataSource.getRepository(ExerciseQuestion),
        dictionary: AppDataSource.getRepository(Dictionary),
        userExerciseResult: AppDataSource.getRepository(UserExerciseResult),
    }
    cached = repositories
    return repositories
}
