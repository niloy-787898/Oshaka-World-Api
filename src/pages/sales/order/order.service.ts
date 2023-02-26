import { Vendor } from './../../../interfaces/user/vendor.interface';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { UtilsService } from '../../../shared/utils/utils.service';
import { Order } from '../../../interfaces/common/order.interface';
import { ResponsePayload } from '../../../interfaces/core/response-payload.interface';
import { ErrorCodes } from '../../../enum/error-code.enum';
import {
  AddOrderDto,
  FilterAndPaginationOrderDto,
  OptionOrderDto,
  UpdateOrderDto,
  UpdateOrderNoDto,
  UpdateOrderStatusDto,
} from '../../../dto/order.dto';
import { Product } from '../../../interfaces/common/product.interface';
import { UniqueId } from '../../../interfaces/core/unique-id.interface';
import { OrderStatus } from '../../../enum/order.enum';
import { User } from '../../../interfaces/user/user.interface';
import { Cart } from '../../../interfaces/common/cart.interface';

const ObjectId = Types.ObjectId;

@Injectable()
export class OrderService {
  private logger = new Logger(OrderService.name);

  constructor(
    @InjectModel('Order') private readonly orderModel: Model<Order>,
    @InjectModel('Product') private readonly productModel: Model<Product>,
    @InjectModel('UniqueId') private readonly uniqueIdModel: Model<UniqueId>,
    @InjectModel('Cart') private readonly cartModel: Model<Cart>,
    @InjectModel('User') private readonly userModel: Model<Cart>,
    private configService: ConfigService,
    private utilsService: UtilsService,
  ) {}

  /**
   * updateOrderNo()
   * addOrder
   * insertManyOrder
   */
  async updateOrderNo(
    updateOrderNoDto: UpdateOrderNoDto,
  ): Promise<ResponsePayload> {
    try {
      if (updateOrderNoDto.password === 'ikbalsazib11') {
        // Update Order Id Unique
        await this.uniqueIdModel.findOneAndUpdate(
          {},
          { $set: { orderId: updateOrderNoDto.count } },
          { new: true, upsert: true },
        );
        return {
          success: true,
          message: 'Order Number Added Success',
          data: null,
        } as ResponsePayload;
      } else {
        return {
          success: false,
          message: 'Password Error',
          data: null,
        } as ResponsePayload;
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async addOrder(addOrderDto: AddOrderDto): Promise<ResponsePayload> {
    // Increment Order Id Unique
    const incOrder = await this.uniqueIdModel.findOneAndUpdate(
      {},
      { $inc: { orderId: 1 } },
      { new: true, upsert: true },
    );

    const orderIdUnique = this.utilsService.padLeadingZeros(incOrder.orderId);

    const dataExtra = {
      orderId: orderIdUnique,
    };
    const mData = { ...addOrderDto, ...dataExtra };
    const newData = new this.orderModel(mData);

    try {
      const saveData = await newData.save();

      // if (saveData.email) {
      //
      //   const file = await this.pdfMakerService.makePDF(saveData)
      //   await this.emailService.sendEmail(saveData.name, saveData.email, file);
      //
      // }

      const data = saveData;
      if (addOrderDto.user) {
        await this.cartModel.deleteMany({
          user: new ObjectId(addOrderDto.user),
        });
        await this.userModel.findOneAndUpdate(
          { _id: addOrderDto.user },
          {
            $set: {
              carts: [],
            },
          },
        );
        if (addOrderDto.coupon) {
          await this.userModel.findOneAndUpdate(
            { _id: addOrderDto.user },
            {
              $push: {
                usedCoupons: addOrderDto.coupon,
              },
            },
          );
        }
      }

      for (const f of addOrderDto['orderedItems']) {
        await this.productModel.findByIdAndUpdate(f._id, {
          $inc: {
            totalSold: f.quantity,
          },
        });

        await this.productModel.findByIdAndUpdate(f._id, {
          $inc: {
            quantity: -f.quantity,
          },
        });
      }

      return {
        success: true,
        message: 'Order Added Success',
        data,
      } as ResponsePayload;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async addOrderByUser(
    addOrderDto: AddOrderDto,
    user: User,
  ): Promise<ResponsePayload> {
    // Add user ID on order dto
    if (user) {
      addOrderDto.user = user._id;
    }
    return this.addOrder(addOrderDto);
  }

  async insertManyOrder(
    addOrdersDto: AddOrderDto[],
    optionOrderDto: OptionOrderDto,
  ): Promise<ResponsePayload> {
    const { deleteMany } = optionOrderDto;
    if (deleteMany) {
      await this.orderModel.deleteMany({});
    }
    const mData = addOrdersDto.map((m) => {
      return {
        ...m,
        ...{
          slug: this.utilsService.transformToSlug(m.name),
        },
      };
    });
    try {
      const saveData = await this.orderModel.insertMany(mData);
      return {
        success: true,
        message: `${
          saveData && saveData.length ? saveData.length : 0
        }  Data Added Success`,
      } as ResponsePayload;
    } catch (error) {
      // console.log(error);
      if (error.code && error.code.toString() === ErrorCodes.UNIQUE_FIELD) {
        throw new ConflictException('Slug Must be Unique');
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }

  /**
   * getAllOrders
   * getOrderById
   */
  async getAllOrders(
    filterOrderDto: FilterAndPaginationOrderDto,
    searchQuery?: string,
  ): Promise<ResponsePayload> {
    const { filter } = filterOrderDto;
    const { pagination } = filterOrderDto;
    const { sort } = filterOrderDto;
    const { select } = filterOrderDto;

    // Essential Variables
    const aggregateStages = [];
    let mFilter = {};
    let mSort = {};
    let mSelect = {};
    let mPagination = {};

    // Match
    if (filter) {
      mFilter = { ...mFilter, ...filter };
    }

    console.log('mFilter', mFilter);
    if (searchQuery) {
      mFilter = {
        $and: [
          mFilter,
          {
            $or: [
              { orderId: { $regex: searchQuery, $options: 'i' } },
              { phoneNo: { $regex: searchQuery, $options: 'i' } },
            ],
          },
        ],
      };
    }
    // Sort
    if (sort) {
      mSort = sort;
    } else {
      mSort = { createdAt: -1 };
    }

    // Select
    if (select) {
      mSelect = { ...select };
    } else {
      mSelect = { name: 1 };
    }

    // Finalize
    if (Object.keys(mFilter).length) {
      aggregateStages.push({ $match: mFilter });
    }

    if (Object.keys(mSort).length) {
      aggregateStages.push({ $sort: mSort });
    }

    if (!pagination) {
      aggregateStages.push({ $project: mSelect });
    }

    // Pagination
    if (pagination) {
      if (Object.keys(mSelect).length) {
        mPagination = {
          $facet: {
            metadata: [{ $count: 'total' }],
            data: [
              {
                $skip: pagination.pageSize * pagination.currentPage,
              } /* IF PAGE START FROM 0 OR (pagination.currentPage - 1) IF PAGE 1*/,
              { $limit: pagination.pageSize },
              { $project: mSelect },
            ],
          },
        };
      } else {
        mPagination = {
          $facet: {
            metadata: [{ $count: 'total' }],
            data: [
              {
                $skip: pagination.pageSize * pagination.currentPage,
              } /* IF PAGE START FROM 0 OR (pagination.currentPage - 1) IF PAGE 1*/,
              { $limit: pagination.pageSize },
            ],
          },
        };
      }

      aggregateStages.push(mPagination);

      aggregateStages.push({
        $project: {
          data: 1,
          count: { $arrayElemAt: ['$metadata.total', 0] },
        },
      });
    }

    try {
      const dataAggregates = await this.orderModel.aggregate(aggregateStages);
      if (pagination) {
        return {
          ...{ ...dataAggregates[0] },
          ...{ success: true, message: 'Success' },
        } as ResponsePayload;
      } else {
        return {
          data: dataAggregates,
          success: true,
          message: 'Success',
          count: dataAggregates.length,
        } as ResponsePayload;
      }
    } catch (err) {
      this.logger.error(err);
      if (err.code && err.code.toString() === ErrorCodes.PROJECTION_MISMATCH) {
        throw new BadRequestException('Error! Projection mismatch');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async getOrdersByUser(
    user: User,
    filterOrderDto: FilterAndPaginationOrderDto,
    searchQuery?: string,
  ): Promise<ResponsePayload> {
    const { filter } = filterOrderDto;

    let mFilter;

    if (filter) {
      mFilter = { ...{ user: new ObjectId(user._id) }, ...filter };
    } else {
      mFilter = { user: new ObjectId(user._id) };
    }

    filterOrderDto.filter = mFilter;

    return this.getAllOrders(filterOrderDto, searchQuery);
  }

  async getOrderById(id: string, select: string): Promise<ResponsePayload> {
    try {
      const data = await this.orderModel.findById(id).select(select);
      return {
        success: true,
        message: 'Success',
        data,
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async getAllOrdersByVendor(
    vendor: Vendor,
    filterOrderDto: FilterAndPaginationOrderDto,
    searchQuery?: string,
  ): Promise<ResponsePayload> {
    const { filter } = filterOrderDto;

    let mFilter;

    if (filter) {
      mFilter = { ...{ vendor: new ObjectId(vendor._id) }, ...filter };
    } else {
      mFilter = { vendor: new ObjectId(vendor._id) };
    }

    filterOrderDto.filter = mFilter;

    return this.getAllOrders(filterOrderDto, searchQuery);
  }

  async getAllOrdersOfVendor(vendorId: string): Promise<ResponsePayload> {
    try {
      const data = await this.orderModel.find({
        vendors: vendorId,
        paymentStatus: 'unpaid',
      });
      return {
        success: true,
        message: 'Success',
        data,
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async getAllVendorOrdersByAdmin(vendorId: string): Promise<ResponsePayload> {
    try {
      const data = await this.orderModel.find({
        vendors: vendorId,
        paymentStatus: 'unpaid',
      });
      return {
        success: true,
        message: 'Success',
        data,
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async getAllTransactionByVendor(vendorId: string): Promise<ResponsePayload> {
    try {
      const data = await this.orderModel.find({
        $and: [
          {
            $or: [{ deliveryStatus: 5 }, { paymentStatus: 'paid' }],
          },
          { vendors: vendorId },
        ],
      });
      return {
        success: true,
        message: 'Success',
        data,
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async getAllVendorTransactionByAdmin(
    vendorId: string,
  ): Promise<ResponsePayload> {
    try {
      const data = await this.orderModel.find({
        $and: [
          {
            $or: [{ deliveryStatus: 5 }, { paymentStatus: 'paid' }],
          },
          { vendors: vendorId },
        ],
      });
      return {
        success: true,
        message: 'Success',
        data,
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
  /**
   * updateOrderById
   * updateMultipleOrderById
   */
  async updateOrderById(
    id: string,
    updateOrderDto: UpdateOrderDto,
  ): Promise<ResponsePayload> {
    const { name } = updateOrderDto;
    let data;
    try {
      data = await this.orderModel.findById(id);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
    if (!data) {
      throw new NotFoundException('No Data found!');
    }
    try {
      await this.orderModel.findByIdAndUpdate(id, {
        $set: updateOrderDto,
      });
      return {
        success: true,
        message: 'Order updated successfully',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  async updateMultipleOrderById(
    ids: string[],
    updateOrderDto: UpdateOrderDto,
  ): Promise<ResponsePayload> {
    const mIds = ids.map((m) => new ObjectId(m));

    try {
      await this.orderModel.updateMany(
        { _id: { $in: mIds } },
        { $set: updateOrderDto },
      );

      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async changeOrderStatus(
    id: string,
    updateOrderStatusDto: UpdateOrderStatusDto,
  ): Promise<ResponsePayload> {
    const { orderStatus } = updateOrderStatusDto;

    let data;
    try {
      data = await this.orderModel.findById(id);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
    if (!data) {
      throw new NotFoundException('No Data found!');
    }
    try {
      let deliveryDate;
      let deliveryDateString;
      console.log('orderStatus', orderStatus);
      if (orderStatus === 5) {
        deliveryDate = this.utilsService.getLocalDateTime();
        deliveryDateString = this.utilsService.getDateString(
          this.utilsService.getLocalDateTime(),
        );
      } else {
        deliveryDate = null;
        deliveryDateString = null;
      }

      // console.log('data', data);
      let orderTimeline;
      if (data.hasOrderTimeline) {
        orderTimeline = data.orderTimeline;
        if (orderStatus === OrderStatus.CONFIRM) {
          orderTimeline.confirmed = {
            success: true,
            date: this.utilsService.getLocalDateTime(),
            expectedDate: null,
          };
        } else if (orderStatus === OrderStatus.PROCESSING) {
          orderTimeline.processed = {
            success: true,
            date: this.utilsService.getLocalDateTime(),
            expectedDate: data.orderTimeline.processed.expectedDate,
          };
        } else if (orderStatus === OrderStatus.SHIPPING) {
          orderTimeline.shipped = {
            success: true,
            date: this.utilsService.getLocalDateTime(),
            expectedDate: data.orderTimeline.shipped.expectedDate,
          };
        } else if (orderStatus === OrderStatus.ReadToPrint) {
          orderTimeline.ReadToPrint = {
            success: true,
            date: this.utilsService.getLocalDateTime(),
            expectedDate: data.orderTimeline.ReadToPrint.expectedDate,
          };
        } else if (orderStatus === OrderStatus.PrintInvoice) {
          orderTimeline.PrintInvoice = {
            success: true,
            date: this.utilsService.getLocalDateTime(),
            expectedDate: data.orderTimeline.PrintInvoice.expectedDate,
          };
        } else if (orderStatus === OrderStatus.ReadyToPackaging) {
          orderTimeline.ReadyToPackaging = {
            success: true,
            date: this.utilsService.getLocalDateTime(),
            expectedDate: data.orderTimeline.ReadyToPackaging.expectedDate,
          };
        } else if (orderStatus === OrderStatus.Packaging) {
          orderTimeline.Packaging = {
            success: true,
            date: this.utilsService.getLocalDateTime(),
            expectedDate: data.orderTimeline.Packaging.expectedDate,
          };
        } else if (orderStatus === OrderStatus.ReadyToShipped) {
          orderTimeline.ReadyToShipped = {
            success: true,
            date: this.utilsService.getLocalDateTime(),
            expectedDate: data.orderTimeline.ReadyToShipped.expectedDate,
          };
        } else if (orderStatus === OrderStatus.HoldInvoice) {
          orderTimeline.HoldInvoice = {
            success: true,
            date: this.utilsService.getLocalDateTime(),
            expectedDate: data.orderTimeline.HoldInvoice.expectedDate,
          };
        } else if (orderStatus === OrderStatus.DELIVERED) {
          orderTimeline.delivered = {
            success: true,
            date: this.utilsService.getLocalDateTime(),
            expectedDate: data.orderTimeline.delivered.expectedDate,
          };

          if (!orderTimeline.confirmed.success) {
            orderTimeline.confirmed = {
              success: true,
              date: this.utilsService.getLocalDateTime(),
              expectedDate: null,
            };
          }
          if (!orderTimeline.processed.success) {
            orderTimeline.processed = {
              success: true,
              date: this.utilsService.getLocalDateTime(),
              expectedDate: data.orderTimeline.processed.expectedDate,
            };
          }
          if (!orderTimeline.shipped.success) {
            orderTimeline.shipped = {
              success: true,
              date: this.utilsService.getLocalDateTime(),
              expectedDate: data.orderTimeline.shipped.expectedDate,
            };
          }
        } else if (orderStatus === OrderStatus.CANCEL) {
          orderTimeline.canceled = {
            success: true,
            date: this.utilsService.getLocalDateTime(),
            expectedDate: null,
          };
        } else if (orderStatus === OrderStatus.REFUND) {
          orderTimeline.refunded = {
            success: true,
            date: this.utilsService.getLocalDateTime(),
            expectedDate: null,
          };
        }
      } else {
        orderTimeline = null;
      }

      const mData = {
        orderStatus: orderStatus,
        orderTimeline: orderTimeline,
        paymentStatus:
          orderStatus === OrderStatus.DELIVERED ? 'paid' : data.paymentStatus,
        deliveryDate: deliveryDate,
        deliveryDateString: deliveryDateString,
      };
      await this.orderModel.findByIdAndUpdate(id, {
        $set: mData,
      });

      if (orderStatus === 6) {
        for (const f of data['orderedItems']) {
          await this.productModel.findByIdAndUpdate(f._id, {
            $inc: {
              quantity: f.quantity,
            },
          });
        }
      }

      return {
        success: true,
        message: 'Order updated successfully',
      } as ResponsePayload;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }

  /**
   * deleteOrderById
   * deleteMultipleOrderById
   */
  async deleteOrderById(
    id: string,
    checkUsage: boolean,
  ): Promise<ResponsePayload> {
    let data;
    try {
      data = await this.orderModel.findById(id);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
    if (!data) {
      throw new NotFoundException('No Data found!');
    }
    try {
      await this.orderModel.findByIdAndDelete(id);
      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async deleteMultipleOrderById(
    ids: string[],
    checkUsage: boolean,
  ): Promise<ResponsePayload> {
    try {
      await this.orderModel.deleteMany({ _id: ids });
      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
