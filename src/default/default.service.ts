import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDefaultDto } from './dto/create-default.dto';
import { UpdateDefaultDto } from './dto/update-default.dto';
import { Restaurant } from '../restaurant/entities/restaurant.entity';
import { User } from '../user/entities/user.entity';
import { RestaurantService } from '../restaurant/restaurant.service';

@Injectable()
export class DefaultService {
  constructor(
  @InjectRepository(Restaurant)
  private readonly restaurantRepository: Repository<Restaurant>,
  @InjectRepository(User)
  private readonly userRepository: Repository<User>,
  ) {}
  async createDefaultRestaurantForUser(userId: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('用户不存在');
    }
    const newRestaurant = new Restaurant();
    newRestaurant.name = 'Your Restaurant Name';
    newRestaurant.describe = 'Description of your restaurant';
    newRestaurant.imageUrl = 'URL to restaurant image';
    newRestaurant.address = 'Restaurant address';
    newRestaurant.owner = user; // 确保这里是 User 实体
    await this.restaurantRepository.save(newRestaurant);
  }

  create(createDefaultDto: CreateDefaultDto) {
    return 'This action adds a new default';
  }

  findAll() {
    return `This action returns all default`;
  }

  findOne(id: number) {
    return `This action returns a #${id} default`;
  }

  update(id: number, updateDefaultDto: UpdateDefaultDto) {
    return `This action updates a #${id} default`;
  }

  remove(id: number) {
    return `This action removes a #${id} default`;
  }
}
