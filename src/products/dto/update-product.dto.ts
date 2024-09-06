import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @IsString()
  @IsOptional()
  name?: string;
  @IsNumber()
  @IsOptional()
  quantity?: number;
}
