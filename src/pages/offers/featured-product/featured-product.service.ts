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
import { FeaturedProduct } from '../../../interfaces/common/featured-product.interface';
import { ResponsePayload } from '../../../interfaces/core/response-payload.interface';
import { ErrorCodes } from '../../../enum/error-code.enum';
import {
  AddFeaturedProductDto,
  FilterAndPaginationFeaturedProductDto,
  OptionFeaturedProductDto,
  UpdateFeaturedProductDto,
} from '../../../dto/featured-product.dto';
import { Product } from '../../../interfaces/common/product.interface';

const ObjectId = Types.ObjectId;

@Injectable()
export class FeaturedProductService {
  private logger = new Logger(FeaturedProductService.name);

  constructor(
    @InjectModel('FeaturedProduct')
    private readonly featuredProductModel: Model<FeaturedProduct>,
    @InjectModel('Product') private readonly productModel: Model<Product>,
    private configService: ConfigService,
    private utilsService: UtilsService,
  ) {}

  /**
   * addFeaturedProduct
   * insertManyFeaturedProduct
   */
  async addFeaturedProduct(
    addFeaturedProductDto: AddFeaturedProductDto,
  ): Promise<ResponsePayload> {
    const mData = { ...addFeaturedProductDto };
    const newData = new this.featuredProductModel(mData);
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

  async insertManyFeaturedProduct(
    addFeaturedProductsDto: AddFeaturedProductDto[],
    optionFeaturedProductDto: OptionFeaturedProductDto,
  ): Promise<ResponsePayload> {
    const { deleteMany } = optionFeaturedProductDto;
    if (deleteMany) {
      await this.featuredProductModel.deleteMany({});
    }
    const mData = addFeaturedProductsDto.map((m) => {
      return {
        ...m,
      };
    });
    try {
      const saveData = await this.featuredProductModel.insertMany(mData);
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
   * getAllFeaturedProducts
   * getFeaturedProductById
   */
  async getAllFeaturedProductsBasic() {
    try {
      const pageSize = 10;
      const currentPage = 3;
      const data = await this.featuredProductModel
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

  async getAllFeaturedProducts(
    filterFeaturedProductDto: FilterAndPaginationFeaturedProductDto,
    searchQuery?: string,
  ): Promise<ResponsePayload> {
    const { filter } = filterFeaturedProductDto;
    const { pagination } = filterFeaturedProductDto;
    const { sort } = filterFeaturedProductDto;
    const { select } = filterFeaturedProductDto;

    // Essential Variables
    const aggregateSfeaturedProductes = [];
    let mFilter = {};
    let mSort = {};
    let mSelect = {};
    let mPagination = {};

    // Match
    if (filter) {
      mFilter = { ...mFilter, ...filter };
    }
    if (searchQuery) {
      mFilter = { ...mFilter, ...{ name: new RegExp(searchQuery, 'i') } };
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
      aggregateSfeaturedProductes.push({ $match: mFilter });
    }

    if (Object.keys(mSort).length) {
      aggregateSfeaturedProductes.push({ $sort: mSort });
    }

    if (!pagination) {
      aggregateSfeaturedProductes.push({ $project: mSelect });
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

      aggregateSfeaturedProductes.push(mPagination);

      aggregateSfeaturedProductes.push({
        $project: {
          data: 1,
          count: { $arrayElemAt: ['$metadata.total', 0] },
        },
      });
    }

    try {
      const dataAggregates = await this.featuredProductModel.aggregate(
        aggregateSfeaturedProductes,
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

  async getFeaturedProductById(
    id: string,
    select: string,
  ): Promise<ResponsePayload> {
    try {
      const data = await this.featuredProductModel.findById(id).select(select);
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
   * updateFeaturedProductById
   * updateMultipleFeaturedProductById
   */
  async updateFeaturedProductById(
    id: string,
    updateFeaturedProductDto: UpdateFeaturedProductDto,
  ): Promise<ResponsePayload> {
    let data;
    try {
      data = await this.featuredProductModel.findById(id);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
    if (!data) {
      throw new NotFoundException('No Data found!');
    }
    try {
      const finalData = { ...updateFeaturedProductDto };

      await this.featuredProductModel.findByIdAndUpdate(id, {
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

  async updateMultipleFeaturedProductById(
    ids: string[],
    updateFeaturedProductDto: UpdateFeaturedProductDto,
  ): Promise<ResponsePayload> {
    const mIds = ids.map((m) => new ObjectId(m));

    try {
      await this.featuredProductModel.updateMany(
        { _id: { $in: mIds } },
        { $set: updateFeaturedProductDto },
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
   * deleteFeaturedProductById
   * deleteMultipleFeaturedProductById
   */
  async deleteFeaturedProductById(
    id: string,
    checkUsage: boolean,
  ): Promise<ResponsePayload> {
    let data;
    try {
      data = await this.featuredProductModel.findById(id);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
    if (!data) {
      throw new NotFoundException('No Data found!');
    }
    try {
      await this.featuredProductModel.findByIdAndDelete(id);
      // Reset Product FeaturedProduct Reference
      if (checkUsage) {
        // Update Product
        await this.productModel.updateMany(
          {},
          {
            $pull: { featuredProducts: new ObjectId(id) },
          },
        );
      }
      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async deleteMultipleFeaturedProductById(
    ids: string[],
    checkUsage: boolean,
  ): Promise<ResponsePayload> {
    try {
      const mIds = ids.map((m) => new ObjectId(m));
      await this.featuredProductModel.deleteMany({ _id: ids });
      // Reset Product Brand Reference
      if (checkUsage) {
        // Update Product
        await this.productModel.updateMany(
          {},
          { $pull: { featuredProducts: { $in: mIds } } },
        );
      }
      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
