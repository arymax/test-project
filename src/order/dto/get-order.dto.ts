import { ApiProperty } from '@nestjs/swagger';

class OrderMealsSelectionDto {
  @ApiProperty()
  option_name: string;

  @ApiProperty()
  option_price: number;
}

class OrderMealsDto {
  @ApiProperty()
  meal_name: string;

  @ApiProperty()
  meal_price: number;

  @ApiProperty({ type: [OrderMealsSelectionDto] })
  selections: OrderMealsSelectionDto[];
}

class OrderResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  order_user_name: string;

  @ApiProperty()
  order_user_email: string;

  @ApiProperty()
  book_time: Date;

  @ApiProperty()
  complete_time: Date | null;

  @ApiProperty({ type: [OrderMealsDto] })
  meals: OrderMealsDto[];
}

export class GetOrdersResponseDto {
  @ApiProperty()
  message: string;

  @ApiProperty({ type: [OrderResponseDto] })
  data: OrderResponseDto[];
}
