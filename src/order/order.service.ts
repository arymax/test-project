import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order, OrderStatus } from '../order/entities/order.entity';
import { Repository } from 'typeorm';
import { OrderStatusDto } from '../order/dto/order-status.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { MealService } from 'src/meal/meal.service';
@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly mealService: MealService,
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

  async createOrder(createOrderBody: CreateOrderDto): Promise<Order> {
    const order = await this.orderRepository.create({
      user: { id: createOrderBody.user_id },
      restaurant: { id: createOrderBody.restaurant_id },
      bookTime: Date.now(),
      status: OrderStatus.PENDING,
      orderMeals: await Promise.all(
        createOrderBody.meals.map(async (orderMeal) => {
          const meal = await this.mealService.findOne(orderMeal.meal_id);
          return {
            meal_name: meal.name,
            meal_price: meal.price,
            count: orderMeal.count,
            orderMealsSelections: orderMeal.selections.map((orderSelection) => {
              const selection = meal.selections.find(
                (selection) => selection.id === orderSelection.selection_id,
              );

              const selectedOption = selection.options.find(
                (option) => option.id === orderSelection.option_id,
              );

              return {
                selection_name: selection.name,
                option_name: selectedOption.name,
                option_price: selectedOption.price,
              };
            }),
          };
        }),
      ),
    });

    const savedOrder = await this.orderRepository.save(order);

    return savedOrder;
  }
}
