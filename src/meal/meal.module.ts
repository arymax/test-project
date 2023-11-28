import { Hashtag } from '../hashtag/entities/hashtag.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { MealService } from './meal.service';
import { MealController } from './meal.controller';
import { MealSelection } from './entities/meal-selection';
import { MealSelectionOption } from './entities/meal-selection-option';
@Module({
  imports: [
    TypeOrmModule.forFeature([Hashtag, MealSelection, MealSelectionOption]),
  ],
  controllers: [MealController],
  providers: [MealService],
})
export class MealModule {}
