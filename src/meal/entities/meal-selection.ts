import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Meal } from './meal.entity';
import { MealSelectionOption } from './meal-selection-option';

@Entity()
export class MealSelection {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Meal, (meal) => meal.selections)
  meal: Meal;

  @Column()
  name: string;

  @OneToMany(() => MealSelectionOption, (option) => option.selection)
  options: MealSelectionOption[];
}
