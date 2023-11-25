import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantService } from './restaurant.service';
import { RestaurantController } from './restaurant.controller';
import { RestaurantBusinessTime } from './entities/restaurant-business-time';
import { Restaurant } from './entities/restaurant.entity';
import { Category } from '../category/entities/category.entity';
import { UserModule } from '../user/user.module'; // 导入 UserModule
@Module({
  imports: [
    TypeOrmModule.forFeature([RestaurantBusinessTime, Category, Restaurant]),
     forwardRef(() => UserModule)
  ],
  controllers: [RestaurantController],
  providers: [RestaurantService],
  exports: [RestaurantService]
})
export class RestaurantModule {}
