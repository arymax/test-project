import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { Restaurant } from '../restaurant/entities/restaurant.entity';
@Module({
  imports: [TypeOrmModule.forFeature([User,Restaurant])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
