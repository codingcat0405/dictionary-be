import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne } from "typeorm"
import { Exercise } from "./Exercise"
import { User } from "./User"
type RelationWrapper<T> = T
@Entity()
export class UserExerciseResult {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  userId!: number

  @Column()
  exerciseId!: number

  @Column({
    type: 'text'
  })
  result!: string //{questionId: number, answer: number}



  @ManyToOne(() => User, (user) => user.userExerciseResults)
  user!: RelationWrapper<User>

  @ManyToOne(() => Exercise, (exercise) => exercise.userExerciseResults)
  exercise!: RelationWrapper<Exercise>

  @Column()
  score!: number //number of correct answers

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  @DeleteDateColumn()
  deletedAt!: Date
} 