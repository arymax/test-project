import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderMeals } from './entities/order-meals.entity';
import { OrderMealsSelection } from './entities/order-meals-selection.entity';
import { MealModule } from 'src/meal/meal.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderMeals, OrderMealsSelection]),
    MealModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
