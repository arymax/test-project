import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { UserService } from '../user/user.service';
@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
    private readonly userService: UserService,
  ) {}
  async getRestaurantDetails(id: number): Promise<any> {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id },
      // 如果有关联的实体，可以在这里添加 relations 选项
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    return {
      message: 'Successful get restaurant data',
      data: {
        image: restaurant.image, // 确保这里是正确的字段名
        name: restaurant.name,
        describe: restaurant.describe,
        address: restaurant.address,
        businessTimes: restaurant.businessTimes, // 确保这里是正确的字段名
      },
    };
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

  async updateRestaurant(
    id: number,
    updateRestaurantDto: UpdateRestaurantDto,
  ): Promise<any> {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id },
      relations: ['owner', 'businessTimes'],
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }
    const { businessTimes, ...updateData } = updateRestaurantDto;
    await this.restaurantRepository.update(id, updateData);

    if (businessTimes) {
    }

    return { message: 'Restaurant updated successfully' };
  }

  remove(id: number) {
    return `This action removes a #${id} restaurant`;
  }
}
