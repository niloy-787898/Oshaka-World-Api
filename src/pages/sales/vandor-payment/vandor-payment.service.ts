import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { UtilsService } from '../../../shared/utils/utils.service';
import { ResponsePayload } from '../../../interfaces/core/response-payload.interface';
import { ErrorCodes } from '../../../enum/error-code.enum';
import { AddVandorPaymentDto } from '../../../dto/vendor-payment.dto';
import { VendorPayment } from '../../../interfaces/common/vendor-payment';

const ObjectId = Types.ObjectId;

@Injectable()
export class VandorPaymentService {
  private logger = new Logger(VandorPaymentService.name);

  constructor(
    @InjectModel('VandorPayment')
    private readonly vandorPaymentModel: Model<VendorPayment>,
    private configService: ConfigService,
    private utilsService: UtilsService,
  ) {}

  /**
   * addVandorPayment
   * insertManyVandorPayment
   */
  async addVandorPayment(
    addVandorPaymentDto: AddVandorPaymentDto,
  ): Promise<ResponsePayload> {
    try {
      const vandorPaymentData = await this.vandorPaymentModel.findOne();
      if (vandorPaymentData) {
        await this.vandorPaymentModel.findByIdAndUpdate(vandorPaymentData._id, {
          $set: addVandorPaymentDto,
        });
        const data = {
          _id: vandorPaymentData._id,
        };

        return {
          success: true,
          message: 'Data Updated Success',
          data,
        } as ResponsePayload;
      } else {
        const newData = new this.vandorPaymentModel(addVandorPaymentDto);
        const saveData = await newData.save();
        const data = {
          _id: saveData._id,
        };

        return {
          success: true,
          message: 'Data Added Success',
          data,
        } as ResponsePayload;
      }
    } catch (error) {
      console.log(error);
      if (error.code && error.code.toString() === ErrorCodes.UNIQUE_FIELD) {
        throw new ConflictException('Slug Must be Unique');
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }

  /**
   * getVandorPayment
   * getVandorPaymentById
   */

  async getVandorPayment(id: string): Promise<ResponsePayload> {
    try {
      const data = await this.vandorPaymentModel
        .find({ vendor: id })
        .populate('paymentBy');
      return {
        success: true,
        message: 'Success',
        data,
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
