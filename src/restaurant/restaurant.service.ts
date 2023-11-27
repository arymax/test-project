import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
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
        image: restaurant.imageUrl, // 确保这里是正确的字段名
        name: restaurant.name,
        describe: restaurant.describe,
        address: restaurant.address,
        businessTime: restaurant.businessTimes, // 确保这里是正确的字段名
      }
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

  async updateRestaurant(id: number, updateRestaurantDto: UpdateRestaurantDto, userId: number): Promise<any> {
    const restaurant = await this.restaurantRepository.findOne({ where: { id } });

    if (!restaurant) {
        throw new NotFoundException('Restaurant not found');
    }

    if (restaurant.owner.id !== userId) {
        throw new ForbiddenException('You don\'t have access authorization to this restaurant');
    }

    // 更新逻辑
    // 注意：这里需要根据您的实际情况来调整，例如处理图片上传等
    await this.restaurantRepository.update(id, updateRestaurantDto);

    return { message: 'successful update data' };
}


  remove(id: number) {
    return `This action removes a #${id} restaurant`;
  }
}

