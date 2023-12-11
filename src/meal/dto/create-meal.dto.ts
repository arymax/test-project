export class TagDto {
  id: string;
  name: string;
}

export class OptionDto {
  id: string;
  name: string;
}

export class SelectionDto {
  id: string;
  name: string;
  options: OptionDto[];
}

export class CreateMealDto {
  categoryId: number;
  image?: string;
  name?: string;
  describe?: string;
  price?: number;
  tags?: TagDto[]; // 添加标签
  selections?: SelectionDto[]; // 添加选择项
}
