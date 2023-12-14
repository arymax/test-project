import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty()
  user_id: number;

  @ApiProperty()
  restaurant_id: number;

  @ApiProperty()
  meals: [
    {
      meal_id: number;
      count: number;
      selections: [
        {
          selection_id: number;
          option_id: number;
        },
      ];
    },
  ];
}

export class CrateOrderResponse {
  message: string;
  data: {
    order_id: number;
  };
}
