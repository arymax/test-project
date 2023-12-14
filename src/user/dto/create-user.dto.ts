import { ApiProperty } from '@nestjs/swagger';

export class createUserDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}
