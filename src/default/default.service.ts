import { Injectable } from '@nestjs/common';
import { CreateDefaultDto } from './dto/create-default.dto';
import { UpdateDefaultDto } from './dto/update-default.dto';
import {RestaurantService } from '../restaurant/restaurant.service';
@Injectable()
export class DefaultService {
  constructor(private readonly restaurantService: RestaurantService) {}

  async initializeDefaultDataForUser(userId: number): Promise<void> {
    await this.restaurantService.initializeRestaurantData(userId);
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
