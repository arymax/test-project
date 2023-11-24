import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Category } from '../../category/entities/category.entity';
import { Hashtag } from '../../hashtag/entities/hashtag.entity';
import { MealSelection } from './meal-selection';
@Entity()
export class Meal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'image_url' })
  imageUrl: string;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  describe: string;

  @ManyToOne(() => Category, category => category.meals)
  category: Category;

  @ManyToMany(() => Hashtag)
  @JoinTable()
  hashtags: Hashtag[];
  @OneToMany(() => MealSelection, selection => selection.meal)
  selections: MealSelection[];
}
