import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { Restaurant } from '../restaurant/entities/restaurant.entity';
import { DefaultModule } from '../default/default.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Restaurant]),
    forwardRef(() => DefaultModule),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
