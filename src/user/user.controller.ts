import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { ApiOkResponse } from '@nestjs/swagger';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from './dto/user-dto';
import { createUserDto } from './dto/create-user.dto';
import { DefaultService } from '../default/default.service';

class LoginRequesttDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly defaultService: DefaultService, // 注入 DefaultService
  ) {}
  @Post('login')
  @ApiOkResponse({
    description: 'Login successful',
    type: UserDto,
  })
  async login(@Body() body: LoginRequesttDto) {
    const user = await this.userService.findOneByEmail(body.email);
    if (!user) {
      throw new BadRequestException('Invalid t credentials');
    }

    if (!bcrypt.compareSync(body.password, user.password)) {
      throw new BadRequestException('Invalid credentials');
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    return { token };
  }
  @Post('register')
  @ApiCreatedResponse({
    description: 'User registration successful',
    type: UserDto,
  })
  async register(@Body() createUserDto: createUserDto) {
    const existingUser = await this.userService.findOneByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    createUserDto.password = bcrypt.hashSync(createUserDto.password, 10);
    const user = await this.userService.create(createUserDto);

    return { success: true, userId: user.id };
  }
  @Post('vendor-register')
  @ApiCreatedResponse({
    description: 'Vendor registration successful',
    type: UserDto,
  })
  async vendorRegister(@Body() createUserDto: createUserDto) {
    const existingUser = await this.userService.findOneByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    createUserDto.password = bcrypt.hashSync(createUserDto.password, 10);
    const user = await this.userService.create(createUserDto);

    await this.defaultService.createDefaultRestaurantForUser(user.id);

    return { success: true, userId: user.id };
  }
}
