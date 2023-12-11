import {
  Body,
  Controller,
  Param,
  Patch,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Post,
} from '@nestjs/common';
import { MealService } from './meal.service';
import { CreateMealDto } from './dto/create-meal.dto';
import { UpdateMealDto } from './dto/update-meal.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { Meal } from './entities/meal.entity';
@Controller('meal')
export class MealController {
  constructor(private readonly mealService: MealService) {}
  @Patch('update-meal/:id')
  @UseInterceptors(FileInterceptor('image'))
  @ApiBody({ type: UpdateMealDto })
  @ApiResponse({
    status: 200,
    description: 'Successfully updated the meal data.',
  })
  async updateMeal(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateMealDto: UpdateMealDto,
  ): Promise<any> {
    if (file) {
    }

    const updatedMeal = await this.mealService.updateMeal(id, updateMealDto);
    return {
      message: 'Successfully updated the meal data.',
      data: updatedMeal,
    };
  }

  @Post('create-meal/default')
  @ApiBody({ type: CreateMealDto })
  @ApiResponse({
    status: 201,
    description: 'Successfully create new default meal data.',
  })
  async createDefaultMeal(
    @Body() createMealDto: CreateMealDto,
  ): Promise<{ message: string; data: any }> {
    const meal = await this.mealService.createDefaultMeal(createMealDto);
    return {
      message: 'Successfully create new default meal data.',
      data: {
        image: meal.imageUrl,
        name: meal.name,
        describe: meal.describe,
        price: meal.price,
        tags:
          meal.hashtags?.map((tag) => ({ id: tag.id, name: tag.name })) ?? [],
        selections:
          meal.selections?.map((selection) => ({
            id: selection.id,
            name: selection.name,
            options:
              selection.options?.map((option) => ({
                id: option.id,
                name: option.name,
              })) ?? [],
          })) ?? [],
      },
    };
  }
}
