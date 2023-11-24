import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { OrderMeals } from './order-meals.entity';
import { MealSelectionOption } from '../../meal/entities/meal-selection-option';

@Entity()
export class OrderMealsSelection {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => OrderMeals)
  orderMeals: OrderMeals;

  @ManyToOne(() => MealSelectionOption)
  mealSelectionOption: MealSelectionOption;
}
