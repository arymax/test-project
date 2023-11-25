import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantService } from './restaurant.service';
import { RestaurantController } from './restaurant.controller';
import { RestaurantBusinessTime } from './entities/restaurant-business-time';
import { Category } from '../category/entities/category.entity';
@Module({
  imports: [TypeOrmModule.forFeature([RestaurantBusinessTime, Category])],
  controllers: [RestaurantController],
  providers: [RestaurantService],
})
export class RestaurantModule {}
