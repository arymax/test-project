import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { OrderMeals } from './order-meals.entity';

@Entity()
export class OrderMealsSelection {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => OrderMeals, (orderMeals) => orderMeals.orderMealsSelections)
  orderMeals: OrderMeals;

  @Column('varchar')
  selection_name: string;

  @Column('varchar')
  option_name: string;

  @Column('float') // 如果价格允许小数，请使用 'float'
  option_price: number;
}
