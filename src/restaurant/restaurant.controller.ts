import {
  Controller,
  Get,
  Body,
  Param,
  Put,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';

import { RestaurantService } from './restaurant.service';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody, ApiParam } from '@nestjs/swagger';
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

  @Get('get-all')
  async findAll() {
    const restaurants =
      await this.restaurantService.findAllWithCategoryAndMeals();

    // average_cost = all meal in restaurant / number of meal in restaurant
    const organizedRestaurants = restaurants.map((restaurant) => ({
      id: restaurant.id,
      name: restaurant.name,
      describe: restaurant.describe,
      address: restaurant.address,
      image: restaurant.image,
      average_cost:
        restaurant.categories.reduce(
          (acc, cur) =>
            acc +
            cur.meals.reduce((acc, cur) => acc + cur.price, 0) /
              cur.meals.length,
          0,
        ) / restaurant.categories.length,
    }));

    return {
      message: 'Successful get all restaurants data',
      data: organizedRestaurants,
    };
  }
}
