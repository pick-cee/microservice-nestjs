import { Product, UploadService } from '@app/common';
import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PRODUCT_SERVICE } from '../constants/services';
import { ClientProxy } from '@nestjs/microservices';
import { CreateProductDto, UpdateProductDto } from './dtos';
import { ProductRepository } from './product.repository';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProductService {
  private logger = new Logger(ProductService.name)
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    @Inject(PRODUCT_SERVICE) private productClient: ClientProxy,
    private readonly prodRepo: ProductRepository,
    private readonly uploadSvc: UploadService
  ) { }

  async createProduct(productDto: CreateProductDto) {
    try {
      const product = await this.prodRepo.create(productDto)

      await firstValueFrom(
        this.productClient.emit('product_created', { product: product })
      )
      return product
    }
    catch (err) {
      throw err
    }
  }

  async updateProductImage(productId: any, productImage: any) {
    try {
      const product = await this.productModel.findOne({ _id: productId }).exec()
      if (!product) {
        throw new NotFoundException('Product not found!')
      }
      const image = await this.uploadSvc.uploadImage(productImage)
      const updatedProduct = await this.prodRepo.findOneAndUpdate({ _id: productId }, { productImage: image })

      return updatedProduct
    }
    catch (err) {
      throw err
    }
  }

  async updateProduct(productId: any, update: UpdateProductDto) {
    const product = await this.productModel.findOne({ _id: productId }).exec()
    if (!product) {
      throw new NotFoundException('Product not found!')
    }
    const updatedProduct = await this.prodRepo.findOneAndUpdate({ _id: productId }, update)
    return updatedProduct
  }

  async getAllProducts() {
    return this.prodRepo.find({})
  }

  async searchProducts(searchQuery: string) {
    const product = await this.productModel.find({ productName: { $regex: searchQuery, $options: 'i' } }).limit(10).exec()
    if (!product) {
      return new NotFoundException('Product not found!')
    }

    return product
  }

}
