import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema } from '../../../schema/product.schema';
import { OrderSchema } from '../../../schema/order.schema';
import { UniqueIdSchema } from '../../../schema/unique-id.schema';
import { CartSchema } from '../../../schema/cart.schema';
import { UserSchema } from '../../../schema/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Order', schema: OrderSchema },
      { name: 'Product', schema: ProductSchema },
      { name: 'UniqueId', schema: UniqueIdSchema },
      { name: 'Cart', schema: CartSchema },
      { name: 'User', schema: UserSchema },
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
