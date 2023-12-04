import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards, Request
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateDefaultCategoryDto  } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiBearerAuth,ApiBody, ApiResponse } from '@nestjs/swagger';
import { DefaultService } from '../default/default.service';
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService,private readonly defaultService: DefaultService) {}
  @Post('/default')
  @ApiBody({ type: CreateDefaultCategoryDto })
  @ApiResponse({ status: 201, description: 'Default category and meal created' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async createDefaultCategoryAndMeal(

    @Body() createDefaultCategoryDto: CreateDefaultCategoryDto,
  ) {
    try {
      await this.defaultService.createDefaultRestaurantForUser(createDefaultCategoryDto.restaurant_id);
      return {
        message: "Successfully created default category and meal",
        data: {
          id: 1,
          name: 'Default category name',
          describe: 'Default category describe',
          meals: {
            id: '1',
            image: 'http://localhost:3000/public/default.jpg',
            name: 'mealOneName',
            describe: 'mealOneDescribe',
            price: 10
          }
        }
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
    return { message: "Successfully update category information" };
}
}
