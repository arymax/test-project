import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, forwardRef } from '@nestjs/common';
import { DefaultService } from './default.service';
import { DefaultController } from './default.controller';
import { Restaurant } from '../restaurant/entities/restaurant.entity';
import { RestaurantBusinessTime } from '../restaurant/entities/restaurant-business-time';
import { User } from '../user/entities/user.entity';
import { Category } from '../category/entities/category.entity';
import { Meal } from '../meal/entities/meal.entity';
import { MealSelection } from '../meal/entities/meal-selection';
import { MealSelectionOption } from '../meal/entities/meal-selection-option';
import { Hashtag } from '../hashtag/entities/hashtag.entity';
import { RestaurantService } from '../restaurant/restaurant.service';
import { MealService } from '../meal/meal.service';
import { CategoryService } from '../category/category.service';
import { UserModule } from '../user/user.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Restaurant, Category, Meal, Hashtag, MealSelection, MealSelectionOption,RestaurantBusinessTime]),
    forwardRef(() => UserModule),
  ],
  controllers: [DefaultController],
  providers: [DefaultService, RestaurantService, MealService, CategoryService],
  exports: [DefaultService],
})
export class DefaultModule {}
