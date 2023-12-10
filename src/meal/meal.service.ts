import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMealDto } from './dto/create-meal.dto';
import { UpdateMealDto } from './dto/update-meal.dto';
import { Meal } from '../meal/entities/meal.entity';
@Injectable()
export class MealService {
  constructor(
    @InjectRepository(Meal)
    private readonly mealRepository: Repository<Meal>,
  ) {}

  async updateMeal(id: number, updateMealDto: UpdateMealDto): Promise<Meal> {
    const meal = await this.mealRepository.findOne({
      where: { id },
      relations: ['hashtags', 'selections'],
    });

    if (!meal) {
      throw new NotFoundException(`Meal with ID ${id} not found`);
    }

    if (typeof updateMealDto.image === 'string') {
      meal.imageUrl = updateMealDto.image;
    } else {
    }

    meal.name = updateMealDto.name;
    meal.describe = updateMealDto.describe;
    meal.price = parseFloat(updateMealDto.price);

    await this.mealRepository.save(meal);
    return meal;
  }
}
