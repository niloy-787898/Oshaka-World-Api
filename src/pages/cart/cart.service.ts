import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { UtilsService } from '../../shared/utils/utils.service';
import { ResponsePayload } from '../../interfaces/core/response-payload.interface';
import { AddCartDto, UpdateCartDto, UpdateCartQty } from '../../dto/cart.dto';
import { Product } from '../../interfaces/common/product.interface';
import { Cart } from 'src/interfaces/common/cart.interface';
import { User } from '../../interfaces/user/user.interface';

const ObjectId = Types.ObjectId;

@Injectable()
export class CartService {
  private logger = new Logger(CartService.name);

  constructor(
    @InjectModel('User') private readonly userModel: Model<Cart>,
    @InjectModel('Cart') private readonly cartModel: Model<Cart>,
    @InjectModel('Product') private readonly productModel: Model<Product>,
    private configService: ConfigService,
    private utilsService: UtilsService,
  ) {}

  /**
   * addToCart()
   * addToCartMultiple()
   */
  async addToCart(
    addCartDto: AddCartDto,
    user: User,
  ): Promise<ResponsePayload> {
    const userId = user._id;
    const data = addCartDto;
    const final = { ...data, ...{ user: userId } };

    try {
      const cartData = await this.cartModel.findOne({
        user: userId,
        product: addCartDto.product,
      });
      if (cartData) {
        await this.cartModel.findByIdAndUpdate(cartData._id, {
          $inc: { selectedQty: addCartDto.selectedQty },
        });
        return {
          success: true,
          message: 'Cart Item Updated Successfully!',
        } as ResponsePayload;
      } else {
        const newData = new this.cartModel(final);
        const saveData = await newData.save();

        await this.userModel.findOneAndUpdate(
          { _id: userId },
          {
            $push: {
              carts: saveData._id,
            },
          },
        );

        return {
          success: true,
          message: 'Added to Cart Successfully!',
        } as ResponsePayload;
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async addToCartMultiple(
    addCartDto: AddCartDto[],
    user: User,
  ): Promise<ResponsePayload> {
    const userId = user._id;

    try {
      for (const data of addCartDto) {
        const cartData = await this.cartModel.findOne({
          user: userId,
          product: data.product,
        });

        if (cartData) {
          await this.cartModel.findByIdAndUpdate(cartData._id, {
            $inc: { selectedQty: data.selectedQty },
          });
        } else {
          const final = { ...data, ...{ user: userId } };
          const newData = new this.cartModel(final);
          const saveData = await newData.save();

          await this.userModel.findOneAndUpdate(
            { _id: userId },
            {
              $push: {
                carts: saveData._id,
              },
            },
          );
        }
      }
      return {
        success: true,
        message: 'Multiple Added to Cart Successfully!',
      } as ResponsePayload;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * getCartByUserId()
   */
  async getCartByUserId(user: User): Promise<ResponsePayload> {
    try {
      const data = await this.cartModel
        .find({ user: user._id })
        .populate(
          'product',
          'name slug description salePrice sku tax discountType discountAmount images quantity category subCategory brand tags unit',
        );

      return {
        data: data,
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }

  /**
   * deleteCartById()
   */
  async deleteCartById(id: string, user: User): Promise<ResponsePayload> {
    try {
      await this.cartModel.findByIdAndDelete(id);

      await this.userModel.findByIdAndUpdate(user._id, {
        $pull: { carts: { $in: id } },
      });

      return {
        success: true,
        message: 'Item Removed Successfully From Cart!',
      } as ResponsePayload;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  /**
   * updateCartDyId()
   */
  async updateCartById(
    id: string,
    updateCartDto: UpdateCartDto,
  ): Promise<ResponsePayload> {
    try {
      console.log('updateCartDto', updateCartDto);
      await this.cartModel.findByIdAndUpdate(id, {
        $set: updateCartDto,
      });

      return {
        success: true,
        message: 'Item Updated Successfully!',
      } as ResponsePayload;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  /**
   * updateCartQty()
   */
  async updateCartQty(
    id: string,
    updateCartQty: UpdateCartQty,
  ): Promise<ResponsePayload> {
    try {
      if (updateCartQty.type == 'increment') {
        await this.cartModel.findByIdAndUpdate(id, {
          $inc: {
            selectedQty: updateCartQty.selectedQty,
          },
        });
      }

      if (updateCartQty.type == 'decrement') {
        await this.cartModel.findByIdAndUpdate(id, {
          $inc: {
            selectedQty: -updateCartQty.selectedQty,
          },
        });
      }

      return {
        success: true,
        message: 'Quantity Updated Successfully!',
      } as ResponsePayload;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(err.message);
    }
  }
}
