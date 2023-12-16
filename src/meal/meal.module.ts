import { Hashtag } from '../hashtag/entities/hashtag.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { MealService } from './meal.service';
import { MealController } from './meal.controller';
import { Meal } from './entities/meal.entity';
import { Category } from '../category/entities/category.entity';
import { MealSelection } from './entities/meal-selection';
import { MealSelectionOption } from './entities/meal-selection-option';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Hashtag,
      MealSelection,
      MealSelectionOption,
      Meal,
      Category,
    ]),
  ],
  controllers: [MealController],
  providers: [MealService],
  exports: [MealService],
})
export class MealModule {}
