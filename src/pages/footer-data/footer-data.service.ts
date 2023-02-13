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
import { UtilsService } from '../../shared/utils/utils.service';
import { ResponsePayload } from '../../interfaces/core/response-payload.interface';
import { ErrorCodes } from '../../enum/error-code.enum';

import { Product } from '../../interfaces/common/product.interface';
import {
  AddFooterDataDto,
  FilterAndPaginationFooterDataDto,
  OptionFooterDataDto,
  UpdateFooterDataDto,
} from '../../dto/footer-data.dto';
import { FooterData } from '../../interfaces/common/footer-data.interface';

const ObjectId = Types.ObjectId;

@Injectable()
export class FooterDataService {
  private logger = new Logger(FooterDataService.name);
  private deleteMany: any;

  constructor(
    @InjectModel('FooterData')
    private readonly FooterDataModel: Model<FooterData>,
    @InjectModel('Product') private readonly productModel: Model<Product>,
    private configService: ConfigService,
    private utilsService: UtilsService,
  ) {}

  /**
   * addFooterData
   * insertManyFooterData
   */
  async addFooterData(
    addFooterDataDto: AddFooterDataDto,
  ): Promise<ResponsePayload> {
    const { shortDes } = addFooterDataDto;

    const defaultData = {
      slug: this.utilsService.transformToSlug(shortDes),
    };
    const mData = { ...addFooterDataDto, ...defaultData };
    const newData = new this.FooterDataModel(mData);
    try {
      const saveData = await newData.save();
      const data = {
        _id: saveData._id,
      };
      return {
        success: true,
        message: 'Data Added Success',
        data,
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
   * getAllFooterDatas
   * getFooterDataById
   */

  async getAllFooterData(): Promise<ResponsePayload> {
    try {
      const saveData = await this.FooterDataModel.findOne();
      return {
        data: saveData,
        success: true,
        message: 'Success',
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
   * updateFooterDataById
   * updateMultipleFooterDataById
   */
  async updateFooterDataById(
    id: string,
    updateFooterDataDto: UpdateFooterDataDto,
  ): Promise<ResponsePayload> {
    const { shortDes } = updateFooterDataDto;
    let data;
    try {
      data = await this.FooterDataModel.findById(id);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
    if (!data) {
      throw new NotFoundException('No Data found!');
    }
    try {
      const finalData = { ...updateFooterDataDto };

      await this.FooterDataModel.findByIdAndUpdate(id, {
        $set: finalData,
      });
      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }
}
