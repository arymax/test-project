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

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Restaurant, { nullable: true })
  restaurant: Restaurant;

  @Column({ type: 'datetime' })
  bookTime: Date;

  @Column({ type: 'datetime', nullable: true })
  completeTime: Date;
  @OneToMany(() => OrderMeals, (orderMeals) => orderMeals.order)
  orderMeals: OrderMeals[];
}
