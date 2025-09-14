import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne } from "typeorm"
import { Exercise } from "./Exercise"
type RelationWrapper<T> = T
@Entity()
export class ExerciseQuestion {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({
    type: 'text'
  })
  question!: string

  @Column({
    type: 'text'
  })
  answerA!: string

  @Column({
    type: 'text'
  })
  answerB!: string

  @Column({
    type: 'text'
  })
  answerC!: string

  @Column({
    type: 'text'
  })
  answerD!: string

  @Column()
  rightAnswer!: number // 0: answerA, 1: answerB, 2: answerC, 3: answerD

  @Column({
    type: 'text',
    nullable: true
  })
  audioUrl?: string // URL to the audio file for this question

  @Column()
  exerciseId!: number

  @ManyToOne(() => Exercise, (exercise) => exercise.questions)
  exercise!: RelationWrapper<Exercise>

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  @DeleteDateColumn()
  deletedAt!: Date
}