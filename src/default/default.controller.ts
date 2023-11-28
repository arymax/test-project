import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DefaultService } from './default.service';
import { CreateDefaultDto } from './dto/create-default.dto';
import { UpdateDefaultDto } from './dto/update-default.dto';

@Controller('default')
export class DefaultController {
  constructor(private readonly defaultService: DefaultService) {}

  @Post()
  create(@Body() createDefaultDto: CreateDefaultDto) {
    return this.defaultService.create(createDefaultDto);
  }

  @Get()
  findAll() {
    return this.defaultService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.defaultService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDefaultDto: UpdateDefaultDto) {
    return this.defaultService.update(+id, updateDefaultDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.defaultService.remove(+id);
  }
}
