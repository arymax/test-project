import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Restaurant } from '../../restaurant/entities/restaurant.entity';
import { OrderMeals } from './order-meals.entity';

export enum OrderStatus {
  PENDING = 'pending',
  READY_FOR_COLLECTION = 'ready_for_collection',
  COMPLETED = 'completed',
}
@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Restaurant, { nullable: true })
  restaurant: Restaurant;
  @Column({ type: 'varchar', enum: OrderStatus, default: OrderStatus.PENDING })
  status: string;
  @Column({ type: 'datetime' })
  bookTime: Date;

  @Column({ type: 'datetime', nullable: true })
  completeTime: Date;
  @OneToMany(() => OrderMeals, (orderMeals) => orderMeals.order)
  orderMeals: OrderMeals[];
}
