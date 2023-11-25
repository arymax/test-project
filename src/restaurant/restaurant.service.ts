import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { UserService } from '../user/user.service'; // 导入 UserService

@Injectable()

export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
    private readonly userRepository: UserService,
    ) {}
  async initializeRestaurantData(userId: number): Promise<void> {
    const user = await this.userRepository.findOne(userId);
  if (!user) {
    throw new Error('用户不存在');
  }
  const newRestaurant = new Restaurant();
  newRestaurant.name = 'Your Restaurant Name';
  newRestaurant.describe = 'Description of your restaurant';
  newRestaurant.imageUrl = 'URL to restaurant image';
  newRestaurant.address = 'Restaurant address';
  newRestaurant.owner =  user; // 确保这里是 User 实体
  const restaurant = await this.restaurantRepository.save(newRestaurant);
}
  create(createRestaurantDto: CreateRestaurantDto) {
    return 'This action adds a new restaurant';
  }

  findAll() {
    return `This action returns all restaurant`;
  }

  findOne(id: number) {
    return `This action returns a #${id} restaurant`;
  }

  update(id: number, updateRestaurantDto: UpdateRestaurantDto) {
    return `This action updates a #${id} restaurant`;
  }

  remove(id: number) {
    return `This action removes a #${id} restaurant`;
  }
}

