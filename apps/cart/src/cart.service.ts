import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CartRepository } from './cart.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Cart, Product } from '@app/common';
import { Model } from 'mongoose';

@Injectable()
export class CartService {

  private logger = new Logger(CartService.name)
  constructor(
    private readonly cartRepo: CartRepository,
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) { }

  async addToCart(userId: any, productId: any) {
    const cart = await this.cartModel.findOne({ userId: userId }).exec()
    const product = await this.productModel.findOne({ _id: productId })

    if (!product) {
      throw new NotFoundException('Product is not available');
    }

    if (!cart) {
      // save doc
      return await this.cartRepo.create({
        userId: userId,
        product: [{
          productId: product._id,
          price: product.price,
          productName: product.productName
        }]
      })
    }
    if (!product) {
      throw new Error('Product is not available');
    }
    const newProductToCart: any = {
      productId: product._id,
      price: product.price,
      productName: product.productName
    }

    cart.product.push(newProductToCart)
    cart.save()
    return cart
  }

  async removeProductFromCart(userId: any, productId: any) {
    const cart = await this.cartModel.findOne({ userId: userId }).exec()
    if (!cart) {
      throw new NotFoundException('Cart cannot be found!')
    }
    const productIndex = cart.product.findIndex(
      (product) => product.productId.toString() === productId
    )
    if (productIndex === -1) {
      throw new NotFoundException('Invalid action, Product not in cart!')
    }

    cart.product.splice(productIndex, 1)
    await cart.save()

  }
}
