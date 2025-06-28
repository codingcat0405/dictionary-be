import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany } from "typeorm"
import { ExerciseQuestion } from "./ExerciseQuestion"
import { UserExerciseResult } from "./UserExerciseResult"
type RelationWrapper<T> = T
@Entity()
export class Exercise {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  name!: string

  @Column()
  description!: string

  @OneToMany(() => ExerciseQuestion, (question) => question.exercise)
  questions!: RelationWrapper<ExerciseQuestion[]>

  @OneToMany(() => UserExerciseResult, (result) => result.exercise)
  userExerciseResults!: RelationWrapper<UserExerciseResult[]>

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  @DeleteDateColumn()
  deletedAt!: Date
} 