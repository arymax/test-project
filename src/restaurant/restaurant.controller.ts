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
} from '@nestjs/common';

import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';

@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}
  @Put('updateRestaurant/:id')
  async updateRestaurant(
    @Param('id') id: number,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
  ): Promise<any> {
    return this.restaurantService.updateRestaurant(id, updateRestaurantDto);
  }
  @Get('getRestaurantDetails/:id')
  async getRestaurantDetails(@Param('id') id: number): Promise<any> {
    return this.restaurantService.getRestaurantDetails(id);
  }
}
