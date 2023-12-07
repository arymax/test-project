import { PartialType } from '@nestjs/swagger';
import { CreateDefaultCategoryDto } from './create-category.dto';

export class UpdateCategoryDto extends PartialType(CreateDefaultCategoryDto) {
  name?: string;
  describe?: string;
}
