import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm"

@Entity()
export class Dictionary {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  word!: string

  @Column({
    nullable: true,
  })
  pronunciation!: string

  @Column({
    type: 'text'
  })
  definition!: string

  @Column({
    nullable: true,
  })
  images!: string

  @Column()
  type!: number // 0: english -> vietnamese, 1: vietnamese -> english

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  @DeleteDateColumn()
  deletedAt!: Date
} 