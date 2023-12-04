import { ApiProperty } from '@nestjs/swagger';
class BusinessTimeDto {
  @ApiProperty()
  weekday: number;

  @ApiProperty()
  businessStartTime: string;

  @ApiProperty()
  businessEndTime: string;

  @ApiProperty()
  isOnBusiness: boolean;
}
export class UpdateRestaurantDto {
  @ApiProperty({ required: false })
  image?: any;

  @ApiProperty({ required: false })
  name?: string;

  @ApiProperty({ required: false })
  describe?: string;

  @ApiProperty({ required: false })
  address?: string;

  @ApiProperty({ required: false, type: [BusinessTimeDto] })
  businessTimes?: BusinessTimeDto[];
}
