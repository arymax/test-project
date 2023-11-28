import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { Meal } from '../meal/entities/meal.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Meal])],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
