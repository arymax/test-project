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
    uploadedImage: any,
  ): Promise<any> {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id },
      relations: ['owner', 'businessTimes'],
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }
    const { businessTimes, image, ...updateData } = updateRestaurantDto;
    await this.restaurantRepository.update(id, updateData);

    if (uploadedImage) {
      const imageName = `restaurant_${id}_${Date.now()}.jpg`;
      const imagePath = join(__dirname, '../public', imageName);
      await writeFile(imagePath,uploadedImage.buffer);

      restaurant.image = `${process.env.BACKEND_URL}/public/${imageName}`;
      await this.restaurantRepository.save(restaurant);
    }


    return { message: 'Restaurant updated successfully' };
  }
  async getRestaurantMeals(id: number): Promise<Category[]> {
    return this.categoryRepository.find({
      where: { restaurant: { id: id } },
      relations: ['meals', 'meals.hashtags', 'meals.selections', 'meals.selections.options'],
    });
  }
}
