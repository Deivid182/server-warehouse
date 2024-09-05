import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ProductsService {
  private products: Product[] = [];
  create(createProductDto: CreateProductDto) {
    const {name, description, price} = createProductDto;

    const newProduct = new Product(
      uuidv4(),
      name,
      description,
      price
    )

    this.products.push(newProduct)

    return newProduct
  }

  findAll() {
    return this.products;
  }

  findOne(id: string) {
    const productFound = this.products.find(product => product.id === id)

    if(!productFound) {
      throw new NotFoundException(`Product with id ${id} not found`)
    }

    return productFound
  }

  update(id: string, updateProductDto: UpdateProductDto) {
    const { description, price, name } = updateProductDto;

    const product = this.findOne(id);

    product.updateWith({name, description, price})

    return product
  }

  remove(id: string) {

    const productFound = this.products.find(product => product.id === id)

    if(!productFound) {
      throw new NotFoundException(`Product with id ${id} not found`)
    }

    this.products = this.products.filter(product => product.id !== id)

    return  `Product with id ${id} deleted`
  }
}
