import { ApiProperty } from '@nestjs/swagger';
export class CreateDefaultCategoryDto {
@ApiProperty({
    description: 'The ID of the restaurant',
    example: 1,
    })
    restaurant_id: number;
  }