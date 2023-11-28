import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, forwardRef } from '@nestjs/common';
import { DefaultService } from './default.service';
import { DefaultController } from './default.controller';
import { RestaurantModule } from '../restaurant/restaurant.module';
import { Restaurant } from '../restaurant/entities/restaurant.entity';
import { User } from '../user/entities/user.entity';
import { RestaurantService } from '../restaurant/restaurant.service';
import { MealService } from '..//meal/meal.service';
import { UserModule } from '../user/user.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Restaurant]),
    forwardRef(() => UserModule),
  ],
  controllers: [DefaultController],
  providers: [DefaultService, RestaurantService, MealService],
  exports: [DefaultService],
})
export class DefaultModule {}
