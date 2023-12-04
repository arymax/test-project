import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Request,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';

import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
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
    return this.restaurantService.updateRestaurant(id, updateRestaurantDto, image);
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
}
