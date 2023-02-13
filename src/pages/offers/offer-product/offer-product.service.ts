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
import { OfferProduct } from '../../../interfaces/common/offer-product.interface';
import { ResponsePayload } from '../../../interfaces/core/response-payload.interface';
import { ErrorCodes } from '../../../enum/error-code.enum';
import {
  AddOfferProductDto,
  FilterAndPaginationOfferProductDto,
  OptionOfferProductDto,
  UpdateOfferProductDto,
} from '../../../dto/offer-product.dto';
import { Product } from '../../../interfaces/common/product.interface';

const ObjectId = Types.ObjectId;

@Injectable()
export class OfferProductService {
  private logger = new Logger(OfferProductService.name);

  constructor(
    @InjectModel('OfferProduct')
    private readonly offerProductModel: Model<OfferProduct>,
    private configService: ConfigService,
    private utilsService: UtilsService,
  ) {}

  /**
   * addOfferProduct
   * insertManyOfferProduct
   */
  async addOfferProduct(
    addOfferProductDto: AddOfferProductDto,
  ): Promise<ResponsePayload> {
    const mData = { ...addOfferProductDto };
    const newData = new this.offerProductModel(mData);
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
        throw new ConflictException();
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }

  async insertManyOfferProduct(
    addOfferProductsDto: AddOfferProductDto[],
    optionOfferProductDto: OptionOfferProductDto,
  ): Promise<ResponsePayload> {
    const { deleteMany } = optionOfferProductDto;
    if (deleteMany) {
      await this.offerProductModel.deleteMany({});
    }
    const mData = addOfferProductsDto.map((m) => {
      return {
        ...m,
      };
    });
    try {
      const saveData = await this.offerProductModel.insertMany(mData);
      return {
        success: true,
        message: `${
          saveData && saveData.length ? saveData.length : 0
        }  Data Added Success`,
      } as ResponsePayload;
    } catch (error) {
      // console.log(error);
      if (error.code && error.code.toString() === ErrorCodes.UNIQUE_FIELD) {
        throw new ConflictException();
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }

  /**
   * getAllOfferProducts
   * getOfferProductById
   */
  async getAllOfferProductsBasic() {
    try {
      const pageSize = 10;
      const currentPage = 1;
      const data = await this.offerProductModel
        .find()
        .skip(pageSize * (currentPage - 1))
        .limit(Number(pageSize));
      return {
        success: true,
        message: 'Success',
        data,
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async getAllOfferProducts(
    filterOfferProductDto: FilterAndPaginationOfferProductDto,
    searchQuery?: string,
  ): Promise<ResponsePayload> {
    const { filter } = filterOfferProductDto;
    const { pagination } = filterOfferProductDto;
    const { sort } = filterOfferProductDto;
    const { select } = filterOfferProductDto;

    // Essential Variables
    const aggregateSofferProductes = [];
    let mFilter = {};
    let mSort = {};
    let mSelect = {};
    let mPagination = {};

    // Match
    if (filter) {
      mFilter = { ...mFilter, ...filter };
    }
    if (searchQuery) {
      mFilter = { ...mFilter, ...{ title: new RegExp(searchQuery, 'i') } };
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
      mSelect = { title: 1 };
    }

    // Finalize
    if (Object.keys(mFilter).length) {
      aggregateSofferProductes.push({ $match: mFilter });
    }

    if (Object.keys(mSort).length) {
      aggregateSofferProductes.push({ $sort: mSort });
    }

    if (!pagination) {
      aggregateSofferProductes.push({ $project: mSelect });
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

      aggregateSofferProductes.push(mPagination);

      aggregateSofferProductes.push({
        $project: {
          data: 1,
          count: { $arrayElemAt: ['$metadata.total', 0] },
        },
      });
    }

    try {
      const dataAggregates = await this.offerProductModel.aggregate(
        aggregateSofferProductes,
      );
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
        throw new InternalServerErrorException(err.message);
      }
    }
  }

  async getOfferProductById(
    id: string,
    select: string,
  ): Promise<ResponsePayload> {
    try {
      const data = await this.offerProductModel.findById(id).select(select);
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
   * updateOfferProductById
   * updateMultipleOfferProductById
   */
  async updateOfferProductById(
    id: string,
    updateOfferProductDto: UpdateOfferProductDto,
  ): Promise<ResponsePayload> {
    let data;
    try {
      data = await this.offerProductModel.findById(id);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
    if (!data) {
      throw new NotFoundException('No Data found!');
    }
    try {
      const finalData = { ...updateOfferProductDto };
      // Check Slug
      await this.offerProductModel.findByIdAndUpdate(id, {
        $set: finalData,
      });
      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  async updateMultipleOfferProductById(
    ids: string[],
    updateOfferProductDto: UpdateOfferProductDto,
  ): Promise<ResponsePayload> {
    const mIds = ids.map((m) => new ObjectId(m));
    try {
      await this.offerProductModel.updateMany(
        { _id: { $in: mIds } },
        { $set: updateOfferProductDto },
      );

      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  /**
   * deleteOfferProductById
   * deleteMultipleOfferProductById
   */
  async deleteOfferProductById(id: string): Promise<ResponsePayload> {
    let data;
    try {
      data = await this.offerProductModel.findById(id);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
    if (!data) {
      throw new NotFoundException('No Data found!');
    }
    try {
      await this.offerProductModel.findByIdAndDelete(id);
      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async deleteMultipleOfferProductById(
    ids: string[],
  ): Promise<ResponsePayload> {
    try {
      const mIds = ids.map((m) => new ObjectId(m));
      await this.offerProductModel.deleteMany({ _id: ids });
      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
