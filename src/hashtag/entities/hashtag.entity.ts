import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Hashtag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
