import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Logger, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto } from './dtos';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtGuard } from 'apps/auth/src/guards';
import { GetUser } from '@app/common';


@Controller('product')
export class ProductController {
  private logger = new Logger(ProductController.name)
  constructor(private readonly productService: ProductService) { }

  @Post('create')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.CREATED)
  async createProduct(@Body() productDto: CreateProductDto
  ) {
    try {
      return await this.productService.createProduct(productDto).catch((err) => { throw err })
    }
    catch (err) {
      throw err
    }
  }

  @HttpCode(HttpStatus.OK)
  @Put('update-product-image')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(JwtGuard)
  async updateProductImage(
    @Query('productId') productId: any,
    @UploadedFile() file: Express.Multer.File
  ) {
    return await this.productService.updateProductImage(productId, file)
  }

  @Put('update-product')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  async updateProduct(@Query() productId: any, @Body() update: UpdateProductDto) {
    return this.productService.updateProduct(productId, update)
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getProducts() {
    return this.productService.getAllProducts()
  }

  @Get('search')
  @HttpCode(HttpStatus.OK)
  async searchProducts(
    @Query('search') search: any
  ) {
    return this.productService.searchProducts(search)
  }

  @Post('create-cart')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.CREATED)
  async createOrder(
    @GetUser('userId') userId: any,
    @Query('productId') productId: any
  ) {
    return this.productService.createCart(userId, productId)
  }

  @Delete('remove-from-cart')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  async removeFromCart(
    @GetUser('userId') userId: any,
    @Query('productId') productId: any
  ) {
    return this.productService.removeProductFromCart(userId, productId)
  }
}
