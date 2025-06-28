import "reflect-metadata"
import { DataSource, Repository } from "typeorm"
import { User } from "./entity/User"

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "database.sqlite",
    synchronize: true,
    logging: false,
    entities: [User],
    migrations: [],
    subscribers: [],
})

export interface Repositories {
    user: Repository<User>
}

let cached: Repositories | null = null


export function getRepositories(): Repositories {
    if(cached) return cached
    const repositories: Repositories = {
        user: AppDataSource.getRepository(User)
    }
    cached = repositories
    return repositories
}
