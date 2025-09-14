import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm"

@Entity()
export class Curriculum {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  title!: string

  @Column({
    type: 'text',
    nullable: true
  })
  description?: string

  @Column()
  fileName!: string

  @Column()
  fileUrl!: string

  @Column()
  fileSize!: number

  @Column()
  mimeType!: string

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  @DeleteDateColumn()
  deletedAt!: Date
}
