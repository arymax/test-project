import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { MealModule } from './meal/meal.module';
import { CategoryModule } from './category/category.module';
import { HashtagModule } from './hashtag/hashtag.module';
import { OrderModule } from './order/order.module';
import { DefaultModule } from './default/default.module';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sql',
      autoLoadEntities: true,
      synchronize: true,
    }),
    UserModule,
    RestaurantModule,
    MealModule,
    CategoryModule,
    HashtagModule,
    OrderModule,
    DefaultModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
