import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Restaurant } from '../../restaurant/entities/restaurant.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Restaurant, (restaurant) => restaurant.owner)
  restaurants: Restaurant[];
}
