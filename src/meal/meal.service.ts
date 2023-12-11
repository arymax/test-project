import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMealDto } from './dto/create-meal.dto';
import { UpdateMealDto } from './dto/update-meal.dto';
import { Meal } from '../meal/entities/meal.entity';
import { MealSelection } from '../meal/entities/meal-selection';
import { Hashtag } from '../hashtag/entities/hashtag.entity';
import { Category } from '../category/entities/category.entity';
@Injectable()
export class MealService {
  constructor(
    @InjectRepository(Meal)
    private readonly mealRepository: Repository<Meal>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Hashtag)
    private readonly hashtagRepository: Repository<Hashtag>,
    @InjectRepository(MealSelection)
    private readonly selectionRepository: Repository<MealSelection>,
  ) {}
  async createDefaultMeal(createMealDto: CreateMealDto): Promise<Meal> {
    const meal = new Meal();
    meal.category = await this.categoryRepository.findOneBy({
      id: createMealDto.categoryId,
    });
    if (!meal.category) {
      throw new NotFoundException(
        `Category with ID ${createMealDto.categoryId} not found`,
      );
    }

    // 设置餐点的默认值
    meal.imageUrl = 'http://localhost:3000/public/default.jpg';
    meal.name = 'mealOneName';
    meal.describe = 'mealOneDescribe';
    meal.price = 10;
    let tags = [];
    if (createMealDto.tags) {
      tags = await Promise.all(
        createMealDto.tags.map(async (tagDto) => {
          let tag = await this.hashtagRepository.findOneBy({
            name: tagDto.name,
          });
          if (!tag) {
            tag = this.hashtagRepository.create({ name: tagDto.name });
            await this.hashtagRepository.save(tag);
          }
          return tag;
        }),
      );
    }
    meal.hashtags = tags;
    if (createMealDto.selections) {
      const selections = await Promise.all(
        createMealDto.selections.map(async (selectionDto) => {
          const selection = this.selectionRepository.create({
            name: selectionDto.name,
            meal: meal, // 关联当前正在创建的 meal 实体
            // 如果有 options，需要创建并设置这些对象
          });
          await this.selectionRepository.save(selection);
          return selection;
        }),
      );

      meal.selections = selections;
    }

    await this.mealRepository.save(meal);
    return meal;
  }
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
