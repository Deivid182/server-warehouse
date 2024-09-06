import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class UpdateProductQuantityDto {
  @IsNumber()
  @Type(() => Number)
  quantity: number;
}
