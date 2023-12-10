import {
  Body,
  Controller,
  Param,
  Patch,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { MealService } from './meal.service';
import { CreateMealDto } from './dto/create-meal.dto';
import { UpdateMealDto } from './dto/update-meal.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
@Controller('update-meal')
export class MealController {
  constructor(private readonly mealService: MealService) {}
  @Patch('/:id')
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
}
