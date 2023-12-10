import { ApiProperty } from '@nestjs/swagger';

class TagDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;
}

class OptionDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;
}

class SelectionDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ type: [OptionDto] })
  options: OptionDto[];
}

export class UpdateMealDto {
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  image?: any; // 用于接收文件或URL

  @ApiProperty()
  name: string;

  @ApiProperty()
  describe: string;

  @ApiProperty()
  price: string;

  @ApiProperty({ type: [TagDto] })
  tags: TagDto[];

  @ApiProperty({ type: [SelectionDto] })
  selections: SelectionDto[];
}
