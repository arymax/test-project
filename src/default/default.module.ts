import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { DefaultService } from './default.service';
import { DefaultController } from './default.controller';
import { RestaurantModule } from '../restaurant/restaurant.module';
@Module({
  imports: [RestaurantModule],
  controllers: [DefaultController],
  providers: [DefaultService],
  exports: [DefaultService]
})
export class DefaultModule {}
