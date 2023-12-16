import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryService } from './category.service';
import { CreateDefaultCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';
import { DefaultService } from '../default/default.service';
import { Restaurant } from '../restaurant/entities/restaurant.entity';
import { Repository } from 'typeorm';
@Controller('category')
export class CategoryController {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
    private readonly categoryService: CategoryService,
    private readonly defaultService: DefaultService,
  ) {}
  @Post('/Create-DefaultCategoryandMeal')
  @ApiBody({ type: CreateDefaultCategoryDto })
  @ApiResponse({
    status: 201,
    description: 'Default category and meal created',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async createDefaultCategoryAndMeal(
    @Body() createDefaultCategoryDto: CreateDefaultCategoryDto,
  ) {
    try {
      // 验证传入的 restaurant_id 对应的餐厅是否存在
      const restaurant = await this.restaurantRepository.findOneBy({
        id: createDefaultCategoryDto.restaurant_id,
      });
      if (!restaurant) {
        throw new NotFoundException(
          `Restaurant with ID ${createDefaultCategoryDto.restaurant_id} not found`,
        );
      }

      // 创建默认分类和餐点，这里假设 createDefaultCategory 方法已经被更新
      // 并且它返回了创建的 Category 实体
      const newCategory = await this.defaultService.createDefaultCategory(
        createDefaultCategoryDto.restaurant_id,
      );
      if (!newCategory.meals || newCategory.meals.length === 0) {
        throw new Error('No meals found in the created category.');
      }

      console.log('Meals found in the category', newCategory.meals);

      return {
        message: 'Successfully created default category and meal',
        data: {
          id: newCategory.id,
          name: newCategory.name,
          describe: newCategory.describe,
          meals: newCategory.meals.map((meal) => {
            console.log('Processing meal:', meal);

            // 检查 hashtags 和 selections 是否存在
            if (!meal.hashtags) {
              console.error('No hashtags found for meal', meal);
            }
            if (!meal.selections) {
              console.error('No selections found for meal', meal);
            }

            return {
              id: meal.id,
              image: meal.imageUrl,
              name: meal.name,
              describe: meal.describe,
              price: meal.price,
              tags: meal.hashtags
                ? meal.hashtags.map((tag) => ({
                    id: tag.id,
                    name: tag.name,
                  }))
                : [],
              selections: meal.selections
                ? meal.selections.map((selection) => ({
                    id: selection.id,
                    name: selection.name,
                    options: selection.options
                      ? selection.options.map((option) => ({
                          id: option.id,
                          name: option.name,
                          price: option.price,
                        }))
                      : [],
                  }))
                : [],
            };
          }),
        },
      };
    } catch (error) {
      return { message: error.message };
    }
  }
  @Patch('updatemeal-category/:id')
  @ApiBearerAuth()
  @ApiBody({ type: UpdateCategoryDto }) // 明确指定请求体的类型
  async updateCategory(
    @Param('id') id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<any> {
    await this.categoryService.updateCategory(id, updateCategoryDto);
    return { message: 'Successfully update category information' };
  }
}
