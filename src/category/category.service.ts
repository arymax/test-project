import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../category/entities/category.entity';
import { Restaurant } from '../restaurant/entities/restaurant.entity';
import { Repository } from 'typeorm';
import { MealService } from 'src/meal/meal.service';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
    private readonly mealService: MealService,
  ) {}

  async updateCategory(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<void> {
    if (Object.keys(updateCategoryDto).length === 0) {
      throw new Error('No data provided for update');
    }
    const { restaurant_id, ...updateData } = updateCategoryDto;
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['restaurant'],
    });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    if (restaurant_id && category.restaurant.id !== restaurant_id) {
      const restaurant = await this.restaurantRepository.findOne({
        where: { id: restaurant_id },
      });
      if (!restaurant) {
        throw new NotFoundException(
          `Restaurant with ID ${restaurant_id} not found`,
        );
      }
      category.restaurant = restaurant;
    }

    // 更新Category的其他信息
    Object.assign(category, updateData);

    // 保存更新后的Category
    await this.categoryRepository.save(category);
  }

  async removeCategory(id: number): Promise<void> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['meals'],
    });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    await Promise.all(
      category.meals.map(async (meal) => {
        await this.mealService.removeMeal(meal.id);
      }),
    );

    await this.categoryRepository.remove(category);
  }
}
