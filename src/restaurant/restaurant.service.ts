import {Injectable,NotFoundException}from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { UserService } from '../user/user.service';
import { writeFile } from 'fs/promises';
import { join } from 'path';
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
      relations: ['businessTimes'],
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }
    const businessTimesFormatted = restaurant.businessTimes ? restaurant.businessTimes.map((bt) => ({
      weekday: bt.weekend,
      business_start_time: bt.startHour,
      business_end_time: bt.endHour,
      is_on_business: bt.isOnBusiness,
    })) : [];

    return {
      message: 'Successful get restaurant data',
      data: {
        image: restaurant.image,
        name: restaurant.name,
        describe: restaurant.describe,
        address: restaurant.address,
        business_time: businessTimesFormatted,
      },
    };
  }
  create(createRestaurantDto: CreateRestaurantDto) {
    return 'This action adds a new restaurant';
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
    const { image, ...updateData } = updateRestaurantDto;
    await this.restaurantRepository.update(id, updateData);

    if (image) {
      const imageName = `restaurant_${id}_${Date.now()}.jpg`;
      const imagePath = join(__dirname, '../public', imageName);
      const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');

      await writeFile(imagePath, buffer);

      restaurant.image = `${process.env.BACKEND_URL}/public/${imageName}`;
      await this.restaurantRepository.save(restaurant);
    }

    // 处理 businessTimes（如果需要）

    return { message: 'Restaurant updated successfully' };
  }
}
