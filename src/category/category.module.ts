import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { MealSelectionOption } from '../meal/entities/meal-selection-option';
import { MealSelection } from '../meal/entities/meal-selection';
import { Hashtag } from '../hashtag/entities/hashtag.entity';
import { User } from '../user/entities/user.entity';
import { Restaurant } from '../restaurant/entities/restaurant.entity';
import { RestaurantBusinessTime } from '../restaurant/entities/restaurant-business-time';
import { Meal } from '../meal/entities/meal.entity';
import { Category } from '../category/entities/category.entity';
import { DefaultService } from '../default/default.service';
import { MealService } from 'src/meal/meal.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Meal,
      Category,
      Restaurant,
      User,
      Hashtag,
      MealSelection,
      MealSelectionOption,
      RestaurantBusinessTime,
    ]),
  ],
  controllers: [CategoryController],
  providers: [CategoryService, DefaultService, MealService],
})
export class CategoryModule {}
