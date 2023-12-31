import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Category } from '../../category/entities/category.entity';
import { User } from '../../user/entities/user.entity';
import { RestaurantBusinessTime } from './restaurant-business-time';

@Entity()
export class Restaurant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  describe: string;

  @Column({ name: 'image_url' })
  image: string;

  @Column()
  address: string;

  @ManyToOne(() => User, (user) => user.restaurants)
  owner: User;

  @OneToMany(
    () => RestaurantBusinessTime,
    (businessTime) => businessTime.restaurant,
  )
  businessTimes: RestaurantBusinessTime[];
  @OneToMany(() => Category, (category) => category.restaurant)
  categories: Category[];
}
