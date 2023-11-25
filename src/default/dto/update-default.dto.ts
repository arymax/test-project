import { PartialType } from '@nestjs/swagger';
import { CreateDefaultDto } from './create-default.dto';

export class UpdateDefaultDto extends PartialType(CreateDefaultDto) {}
