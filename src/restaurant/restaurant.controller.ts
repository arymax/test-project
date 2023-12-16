import {
  Controller,
  Get,
  Body,
  Param,
  Put,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';

import { RestaurantService } from './restaurant.service';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody, ApiParam } from '@nestjs/swagger';
import getRecommendRestaurants from './../util/getRecommandation';
@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}
  @Put('updateRestaurant/:id')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '更新餐厅信息和上传图片',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        describe: { type: 'string' },
        address: { type: 'string' },
        businessTimes: { type: 'array', items: { type: 'object' } },
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiParam({ name: 'id', type: 'number' })
  @UseInterceptors(FileInterceptor('image'))
  async updateRestaurant(
    @Param('id') id: number,
    @UploadedFile() image,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
  ): Promise<any> {
    return this.restaurantService.updateRestaurant(
      id,
      updateRestaurantDto,
      image,
    );
  }
  @Get('getRestaurantDetails/:id')
  async getRestaurantDetails(@Param('id') id: number): Promise<any> {
    return this.restaurantService.getRestaurantDetails(id);
  }
  @Get('mealsget/:id')
  async getRestaurantMeals(@Param('id') id: number): Promise<any> {
    const categories = await this.restaurantService.getRestaurantMeals(id);
    return {
      message: "Successfully get restaurant's meals",
      data: { categories },
    };
  }

  @Get('getRecommendRestaurant')
  async getRecommendRestaurant(
    @Query('lat') lat: number,
    @Query('lot') lot: number,
    @Query('tags') tags: string[],
  ): Promise<any> {
    const restaurants =
      await this.restaurantService.findAllRestaurantWithMeals();

    type OrganizedRestaurants = Parameters<typeof getRecommendRestaurants>[2];

    function getMockAddressLocation(address: string) {
      return {
        latitude: 25.033,
        longitude: 121.565,
      };
    }

    const organizedRestaurants: OrganizedRestaurants = restaurants.map(
      (restaurant) => {
        const { id, address, categories } = restaurant;
        return {
          restaurant_id: id,
          location: getMockAddressLocation(address),
          menu: categories.reduce(
            (acc, cur) => [
              ...acc,
              ...cur.meals.map((meal) => ({
                dish_name: meal.name,
                tags: meal.hashtags.map((hashtag) => hashtag.name),
              })),
            ],
            [],
          ),
        };
      },
    );

    const recommandRestaurants = getRecommendRestaurants(
      { latitude: lat, longitude: lot },
      tags,
      organizedRestaurants,
    );

    const recommandRestaurantWithDetails = await Promise.all(
      recommandRestaurants.map(async (recommandRestaurant) => {
        const restaurant = await this.restaurantService.getRestaurantDetails(
          recommandRestaurant.restaurant_id,
        );
        return restaurant.data;
      }),
    );

    return {
      message: 'Successfully get recommand restaurants',
      data: recommandRestaurantWithDetails,
    };
  }
}
