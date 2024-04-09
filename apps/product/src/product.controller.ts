import { Body, Controller, Get, HttpCode, HttpStatus, Logger, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto } from './dtos';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtGuard } from 'apps/auth/src/guards';


@Controller('product')
export class ProductController {
  private logger = new Logger(ProductController.name)
  constructor(private readonly productService: ProductService) { }

  @Post('create')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  async createProduct(@Body() productDto: CreateProductDto
  ) {
    try {
      return await this.productService.createProduct(productDto).catch((err) => { throw err })
    }
    catch (err) {
      throw err
    }
  }

  @Put('update-product-image')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  async updateProductImage(
    @Query('productId') productId: any,
    @UploadedFile() file: Express.Multer.File | any
  ) {
    return await this.productService.updateProductImage(productId, file)
  }

  @Put('update-product')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  async updateProduct(productId: any, update: UpdateProductDto) {
    return this.productService.updateProduct(productId, update)
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getProducts() {
    return this.productService.getAllProducts()
  }
}
