import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm"
import { UserExerciseResult } from "./UserExerciseResult"
type RelationWrapper<T> = T
@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    fullName!: string

    @Column()
    username!: string

    @Column()
    password!: string

    @Column()
    role!: string

    @OneToMany(() => UserExerciseResult, (result) => result.user)
    userExerciseResults!: RelationWrapper<UserExerciseResult[]>

    @CreateDateColumn()
    createdAt!: Date

    @UpdateDateColumn()
    updatedAt!: Date

}
