import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Order } from './order.entity';
import { Meal } from '../../meal/entities/meal.entity';

@Entity()
export class OrderMeals {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order)
  order: Order;
  @Column('varchar')
  meal_name: string;

  // 記錄當下的price
  @Column('float')
  meal_price: number;
}
