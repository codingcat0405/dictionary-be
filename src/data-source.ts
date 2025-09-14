import "reflect-metadata"
import { DataSource, Repository } from "typeorm"
import { User } from "./entity/User"
import { Exercise } from "./entity/Exercise"
import { ExerciseQuestion } from "./entity/ExerciseQuestion"
import { Dictionary } from "./entity/Dictionary"
import { UserExerciseResult } from "./entity/UserExerciseResult"
import { Curriculum } from "./entity/Curriculum"
import { mkdirSync } from "fs"
import path from "path"

const dataDir = path.join(process.cwd(), 'data')
mkdirSync(dataDir, { recursive: true })


export const AppDataSource = new DataSource({
    type: "sqlite",
    database: path.join(dataDir, "database.sqlite"),
    synchronize: true,
    logging: false,
    entities: [User, Exercise, ExerciseQuestion, Dictionary, UserExerciseResult, Curriculum],
    migrations: [],
    subscribers: [],
})

export interface Repositories {
    user: Repository<User>,
    exercise: Repository<Exercise>,
    exerciseQuestion: Repository<ExerciseQuestion>,
    dictionary: Repository<Dictionary>,
    userExerciseResult: Repository<UserExerciseResult>,
    curriculum: Repository<Curriculum>,
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
        curriculum: AppDataSource.getRepository(Curriculum),
    }
    cached = repositories
    return repositories
}
