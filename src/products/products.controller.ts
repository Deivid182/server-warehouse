import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query, InternalServerErrorException, BadRequestException, UseGuards,  } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './schemas/product.schema';
import { isValidObjectId } from 'mongoose';
import { UpdateProductQuantityDto } from './dto/update-product.quantity.dto';
import { Roles } from 'src/auth/roles/roles.decorator';
import { RoleGuard } from 'src/auth/role/role.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}
  validateMongoId(id: string) {
    return isValidObjectId(id);
  }
  @Roles('warehouseman')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Roles('warehouseman', 'employee')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ): Promise<{ products: Product[], total: number, totalPages: number }> {
    return await this.productsService.findAll(page, limit);
  }

  @Roles('warehouseman', 'employee')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    if (!this.validateMongoId(id)) {
      throw new BadRequestException(`Invalid MongoDB ID: ${id}`);
    }
    try {
      return this.productsService.findOne(id);
    } catch (error) {
      throw new InternalServerErrorException('Error fetching product');
    }
  }

  @Roles('warehouseman')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    if (!this.validateMongoId(id)) {
      throw new BadRequestException(`Invalid MongoDB ID: ${id}`);
    }
    try {
      return this.productsService.update(id, updateProductDto);
    } catch (error) {
      throw new InternalServerErrorException('Error updating product');
    }
  }

  @Roles('warehouseman', 'employee')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Patch(':id/quantity')
  updateQuantity(@Param('id') id: string, @Body() updateQuantyDto: UpdateProductQuantityDto) {
    if (!this.validateMongoId(id)) {
      throw new BadRequestException(`Invalid MongoDB ID: ${id}`);
    }
    return this.productsService.updateQuantity(id, updateQuantyDto.quantity);
  }

  @Roles('warehouseman')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    if (!this.validateMongoId(id)) {
      throw new BadRequestException(`Invalid MongoDB ID: ${id}`);
    }
    return this.productsService.remove(id);
  }
}
