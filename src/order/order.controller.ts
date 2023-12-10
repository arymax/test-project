import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { GetOrdersResponseDto } from './dto/get-order.dto';
import { ApiParam, ApiResponse } from '@nestjs/swagger';
import { OrderStatusDto } from '../order/dto/order-status.dto';
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  @Get('restaurant-order-get/:restaurantId')
  @ApiResponse({ status: 200, type: GetOrdersResponseDto })
  async getRestaurantOrders(
    @Param('restaurantId') restaurantId: number,
  ): Promise<GetOrdersResponseDto> {
    const orders = await this.orderService.getRestaurantOrders(restaurantId);

    const data = orders.map((order) => ({
      id: order.id.toString(),
      order_user_name: order.user?.name || 'Unknown User',
      order_user_email: order.user?.email || 'Unknown Email',
      book_time: order.bookTime,
      complete_time: order.completeTime || null,
      meals: order.orderMeals.map((orderMeal) => ({
        meal_name: orderMeal.meal_name,
        meal_price: orderMeal.meal_price,
        selections: orderMeal.orderMealsSelections.map((selection) => ({
          option_name: selection.option_name,
          option_price: selection.option_price,
        })),
      })),
    }));

    return {
      message: "Sucessfully get restaurant's meals",
      data: data,
    };
  }
  @Patch('notify-customer-get-order/:orderId')
  @ApiParam({ name: 'orderId', type: 'number', required: true })
  @ApiResponse({ status: 200, type: OrderStatusDto })
  async changeOrderStatusToReady(
    @Param('orderId') orderId: number,
  ): Promise<OrderStatusDto> {
    await this.orderService.changeOrderStatusToReady(orderId);
    return { message: 'Order status updated to ready for collection.' };
  }
}
