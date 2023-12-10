import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order, OrderStatus } from '../order/entities/order.entity';
import { Repository } from 'typeorm';
import { OrderStatusDto } from '../order/dto/order-status.dto';
@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async getRestaurantOrders(restaurantId: number): Promise<Order[]> {
    return this.orderRepository.find({
      where: { restaurant: { id: restaurantId } },
      relations: ['orderMeals', 'orderMeals.orderMealsSelections'],
    });
  }
  async changeOrderStatusToReady(orderId: number): Promise<OrderStatusDto> {
    const order = await this.orderRepository.findOneBy({ id: orderId });
    if (!order) {
      throw new NotFoundException('Order not found.');
    }
    order.status = OrderStatus.READY_FOR_COLLECTION;
    await this.orderRepository.save({
      ...order,
      status: order.status.toString(),
    });

    return { message: 'Order status updated to ready for collection.' };
  }
}
