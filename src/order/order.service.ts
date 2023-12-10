import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '../order/entities/order.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    // 可能还需要其他的repository，比如MealRepository
  ) {}

  async getRestaurantOrders(restaurantId: number): Promise<Order[]> {
    return this.orderRepository.find({
      where: { restaurant: { id: restaurantId } },
      relations: ['orderMeals', 'orderMeals.orderMealsSelections'],
    });
  }
}
