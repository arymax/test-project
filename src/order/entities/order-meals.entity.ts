import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Order } from './order.entity';
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

  @Column('int')
  count: number;

  @OneToMany(
    () => OrderMealsSelection,
    (orderMealsSelection) => orderMealsSelection.orderMeals,
  )
  orderMealsSelections: OrderMealsSelection[];
}
