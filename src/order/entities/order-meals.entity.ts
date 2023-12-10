import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Order } from './order.entity';
import { Meal } from '../../meal/entities/meal.entity';
import { OrderMealsSelection } from './order-meals-selection.entity';
@Entity()
export class OrderMeals {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (order) => order.orderMeals)
  order: Order;
  @Column('varchar')
  meal_name: string;

  // 記錄當下的price
  @Column('float')
  meal_price: number;

  @OneToMany(
    () => OrderMealsSelection,
    (orderMealsSelection) => orderMealsSelection.orderMeals,
  )
  orderMealsSelections: OrderMealsSelection[];
}
