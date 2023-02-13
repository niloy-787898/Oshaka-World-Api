import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { UtilsService } from '../../shared/utils/utils.service';
import {Order} from '../../interfaces/common/order.interface';
import {Admin} from '../../interfaces/admin/admin.interface';
import {User} from '../../interfaces/user/user.interface';
import {ResponsePayload} from '../../interfaces/core/response-payload.interface';
import {Product} from '../../interfaces/common/product.interface';

const ObjectId = Types.ObjectId;

@Injectable()
export class DashboardService {
  private logger = new Logger(DashboardService.name);

  constructor(
    @InjectModel('Admin')
    private readonly adminModel: Model<Admin>,
    @InjectModel('User')
    private readonly userModel: Model<User>,
    @InjectModel('Product')
    private readonly productModel: Model<Product>,
    @InjectModel('Order')
    private readonly orderModel: Model<Order>,
    private configService: ConfigService,
    private utilsService: UtilsService,
  ) {}

  async getAdminDashboard(): Promise<ResponsePayload> {
    try {
      // const day7 = this.utilsService.getNextDateString(new Date(), -7);
      const today = this.utilsService.getDateString(new Date());
      const nextDay = this.utilsService.getNextDateString(new Date(), 1);

      const totalOrders = await this.orderModel.countDocuments({});
      const pendingOrders = await this.orderModel.countDocuments({
        orderStatus : 1,
      });
      const confirmOrders = await this.orderModel.countDocuments({
        orderStatus : 2,
      });
      const processingOrders = await this.orderModel.countDocuments({
        orderStatus : 3,
      });
      const shippingOrders = await this.orderModel.countDocuments({
        orderStatus : 4,
      });
      const deliveredOrders = await this.orderModel.countDocuments({
        orderStatus : 5,
      });
      const cancelOrders = await this.orderModel.countDocuments({
        orderStatus : 6,
      });
      const refundOrders = await this.orderModel.countDocuments({
        orderStatus : 7,
      });
      const PrintInvoice = await this.orderModel.countDocuments({
        orderStatus : 8,
      });
      const ReadyToPackaging = await this.orderModel.countDocuments({
        orderStatus : 9,
      });

      const Packaging = await this.orderModel.countDocuments({
        orderStatus : 10,
      });
      const ReadyToShipped = await this.orderModel.countDocuments({
        orderStatus : 11,
      });
      const ReadToPrint = await this.orderModel.countDocuments({
        orderStatus : 12,
      });
      const HoldInvoice = await this.orderModel.countDocuments({
        orderStatus : 13,
      });
      const countTodayAddedOrder = await this.orderModel.countDocuments({
        createdAt: { $gte: new Date(today), $lt: new Date(nextDay) },
      });

      const totalProducts = await this.productModel.countDocuments({});

      const data = {
        totalOrders,
        pendingOrders,
        countTodayAddedOrder,
        totalProducts,
        confirmOrders,
        processingOrders,
        shippingOrders,
        deliveredOrders,
        cancelOrders,
        refundOrders,
        PrintInvoice,
        ReadyToPackaging,
        Packaging,
        ReadyToShipped,
        ReadToPrint,
        HoldInvoice,

      };

      return {
        success: true,
        message: 'Data Retrieve Success',
        data,
      } as ResponsePayload;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  // async getCatalogDashboard(): Promise<ResponsePayload> {
  //   try {
  //     const totalMakers = await this.makerModel.countDocuments({});
  //     const totalModels = await this.modelModel.countDocuments({});
  //     const totalTags = await this.tagModel.countDocuments({});
  //
  //     const data = {
  //       totalMakers,
  //       totalModels,
  //       totalTags,
  //     };
  //
  //     return {
  //       success: true,
  //       message: 'Data Retrieve Success',
  //       data,
  //     } as ResponsePayload;
  //   } catch (error) {
  //     throw new InternalServerErrorException(error.message);
  //   }
  // }

  // async getMerchantDashboard(merchant: Merchant): Promise<ResponsePayload> {
  //   try {
  //     const totalApprovedProducts = await this.productModel.countDocuments({
  //       merchant: new ObjectId(merchant._id),
  //       approved: true,
  //     });
  //     const totalPendingProducts = await this.productModel.countDocuments({
  //       merchant: new ObjectId(merchant._id),
  //       approved: false,
  //     });
  //     const merchantData = await this.merchantModel
  //       .findById(merchant._id)
  //       .select('subscriptions');
  //
  //     // console.log('merchantData', merchantData)
  //     const mMerchantData = JSON.parse(JSON.stringify(merchantData));
  //
  //     let hasSubscription;
  //     const activeSubscriptions: ActiveSubscription[] = [];
  //     if (
  //       mMerchantData &&
  //       mMerchantData.subscriptions &&
  //       mMerchantData.subscriptions.length
  //     ) {
  //       for (const subscription of mMerchantData.subscriptions) {
  //         if (subscription && subscription['endDate']) {
  //           const isExpired = this.utilsService.getDateDifference(
  //             new Date(),
  //             new Date(subscription.endDate),
  //             'seconds',
  //           );
  //           if (isExpired <= 0) {
  //             // await this.merchantModel.findByIdAndUpdate(merchant._id, {
  //             //   $pull: { 'subscriptions._id': new ObjectId(subscription._id) },
  //             // });
  //           } else {
  //             activeSubscriptions.push(subscription);
  //           }
  //         }
  //       }
  //
  //       if (activeSubscriptions && activeSubscriptions.length) {
  //         hasSubscription = 'Yes';
  //       } else {
  //         hasSubscription = 'No';
  //       }
  //     } else {
  //       hasSubscription = 'No';
  //     }
  //
  //     const data = {
  //       totalApprovedProducts,
  //       totalPendingProducts,
  //       subscription: hasSubscription,
  //     };
  //
  //     return {
  //       success: true,
  //       message: 'Data Retrieve Success',
  //       data,
  //     } as ResponsePayload;
  //   } catch (error) {
  //     throw new InternalServerErrorException(error.message);
  //   }
  // }
}
