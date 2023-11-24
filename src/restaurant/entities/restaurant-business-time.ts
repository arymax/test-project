import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Restaurant } from './restaurant.entity';

@Entity()
export class RestaurantBusinessTime {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Restaurant, restaurant => restaurant.businessTimes)
  restaurant: Restaurant;

  @Column()
  weekend: number;

  @Column({ name: 'start_hour' })
  startHour: number;

  @Column({ name: 'end_hour' })
  endHour: number;

  @Column({ name: 'is_on_business', type: 'boolean' })
  isOnBusiness: boolean;
}
