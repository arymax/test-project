import { ApiProperty } from '@nestjs/swagger';

type OrderMeal = {
  meal_id: number;
  count: number;
  selections: [
    {
      selection_id: number;
      option_id: number;
    },
  ];
};

export class CreateOrderDto {
  @ApiProperty()
  user_id: number;

  @ApiProperty()
  restaurant_id: number;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'object',
      properties: {
        meal_id: { type: 'number' },
        count: { type: 'number' },
        selections: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              selection_id: { type: 'number' },
              option_id: { type: 'number' },
            },
          },
        },
      },
    },
  })
  meals: OrderMeal[];
}

export class CrateOrderResponse {
  message: string;
  data: {
    order_id: number;
  };
}
