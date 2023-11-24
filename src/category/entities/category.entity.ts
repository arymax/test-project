import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Restaurant } from '../../restaurant/entities/restaurant.entity';
import { Meal } from '../../meal/entities/meal.entity'

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Restaurant, restaurant => restaurant.categories)
  restaurant: Restaurant;

  @Column()
  name: string;

  @Column()
  describe: string;

  @OneToMany(() => Meal, meal => meal.category)
  meals: Meal[];
}
