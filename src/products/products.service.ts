import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Model } from 'mongoose';
import { Product } from './schemas/product.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>
  ){}
  async create(createProductDto: CreateProductDto) {
    const product = await new this.productModel(createProductDto).save()
    return product
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{ products: Product[], total: number, page: number, totalPages: number }> {
    const skip = (page - 1) * limit;
    const count = await this.productModel.countDocuments();
    const totalPages = Math.ceil(count / limit);
    const lastPage = Math.ceil(count / limit);

    const products = await this.productModel
      .find({ active: true})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    return {
      products,
      total: count,
      page,
      totalPages,
    };
  }

  async findOne(id: string) {
    const productFound = await this.productModel.findOne({ _id: id, active: true })
    if(!productFound) {
      throw new NotFoundException('Product not found')
    }
    return productFound
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    await this.findOne(id)
    return this.productModel.findByIdAndUpdate(id, updateProductDto, { new: true })
  }

  async updateQuantity(id: string, quantity: number) {
    await this.findOne(id)
    return this.productModel.findByIdAndUpdate(id, { quantity }, { new: true })
  }

  async remove(id: string) {
    await this.findOne(id)
    return this.productModel.findByIdAndUpdate(id, { active: false }, { new: true })
  }
}
