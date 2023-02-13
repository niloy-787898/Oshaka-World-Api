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
import { Variation } from '../../../interfaces/common/variation.interface';
import { ResponsePayload } from '../../../interfaces/core/response-payload.interface';
import { ErrorCodes } from '../../../enum/error-code.enum';
import {
  AddVariationDto,
  FilterAndPaginationVariationDto,
  OptionVariationDto,
  UpdateVariationDto,
} from '../../../dto/variation.dto';
import { Product } from '../../../interfaces/common/product.interface';

const ObjectId = Types.ObjectId;

@Injectable()
export class VariationService {
  private logger = new Logger(VariationService.name);

  constructor(
    @InjectModel('Variation') private readonly variationModel: Model<Variation>,
    @InjectModel('Product') private readonly productModel: Model<Product>,
    private configService: ConfigService,
    private utilsService: UtilsService,
  ) {}

  /**
   * addVariation
   * insertManyVariation
   */
  async addVariation(
    addVariationDto: AddVariationDto,
  ): Promise<ResponsePayload> {
    const { name } = addVariationDto;

    const defaultData = {
      slug: this.utilsService.transformToSlug(name),
    };
    const mData = { ...addVariationDto, ...defaultData };
    const newData = new this.variationModel(mData);
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

  async insertManyVariation(
    addVariationsDto: AddVariationDto[],
    optionVariationDto: OptionVariationDto,
  ): Promise<ResponsePayload> {
    const { deleteMany } = optionVariationDto;
    if (deleteMany) {
      await this.variationModel.deleteMany({});
    }
    const mData = addVariationsDto.map((m) => {
      return {
        ...m,
        ...{
          slug: this.utilsService.transformToSlug(m.name),
        },
      };
    });
    try {
      const saveData = await this.variationModel.insertMany(mData);
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
   * getAllVariations
   * getVariationById
   */
  async getAllVariationsBasic() {
    try {
      const pageSize = 10;
      const currentPage = 3;
      const data = await this.variationModel
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

  async getAllVariations(
    filterVariationDto: FilterAndPaginationVariationDto,
    searchQuery?: string,
  ): Promise<ResponsePayload> {
    const { filter } = filterVariationDto;
    const { pagination } = filterVariationDto;
    const { sort } = filterVariationDto;
    const { select } = filterVariationDto;

    // Essential Variables
    const aggregateSvariationes = [];
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
      aggregateSvariationes.push({ $match: mFilter });
    }

    if (Object.keys(mSort).length) {
      aggregateSvariationes.push({ $sort: mSort });
    }

    if (!pagination) {
      aggregateSvariationes.push({ $project: mSelect });
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

      aggregateSvariationes.push(mPagination);

      aggregateSvariationes.push({
        $project: {
          data: 1,
          count: { $arrayElemAt: ['$metadata.total', 0] },
        },
      });
    }

    try {
      const dataAggregates = await this.variationModel.aggregate(
        aggregateSvariationes,
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

  async getVariationById(id: string, select: string): Promise<ResponsePayload> {
    try {
      const data = await this.variationModel.findById(id).select(select);
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
   * updateVariationById
   * updateMultipleVariationById
   */
  async updateVariationById(
    id: string,
    updateVariationDto: UpdateVariationDto,
  ): Promise<ResponsePayload> {
    const { name } = updateVariationDto;
    let data;
    try {
      data = await this.variationModel.findById(id);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
    if (!data) {
      throw new NotFoundException('No Data found!');
    }
    try {
      const finalData = { ...updateVariationDto };
      // Check Slug
      if (name)
        if (name && data.name !== name) {
          finalData.slug = this.utilsService.transformToSlug(name, true);
        }

      await this.variationModel.findByIdAndUpdate(id, {
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

  async updateMultipleVariationById(
    ids: string[],
    updateVariationDto: UpdateVariationDto,
  ): Promise<ResponsePayload> {
    const mIds = ids.map((m) => new ObjectId(m));

    // Delete No Multiple Action Data
    if (updateVariationDto.slug) {
      delete updateVariationDto.slug;
    }

    try {
      await this.variationModel.updateMany(
        { _id: { $in: mIds } },
        { $set: updateVariationDto },
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
   * deleteVariationById
   * deleteMultipleVariationById
   */
  async deleteVariationById(
    id: string,
    checkUsage: boolean,
  ): Promise<ResponsePayload> {
    let data;
    try {
      data = await this.variationModel.findById(id);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
    if (!data) {
      throw new NotFoundException('No Data found!');
    }
    try {
      await this.variationModel.findByIdAndDelete(id);
      // Reset Product Variation Reference
      if (checkUsage) {
        // Update Product
        await this.productModel.updateMany(
          {},
          {
            $pull: { variations: new ObjectId(id) },
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

  async deleteMultipleVariationById(
    ids: string[],
    checkUsage: boolean,
  ): Promise<ResponsePayload> {
    try {
      const mIds = ids.map((m) => new ObjectId(m));
      await this.variationModel.deleteMany({ _id: ids });
      // Reset Product Brand Reference
      if (checkUsage) {
        // Update Product
        await this.productModel.updateMany(
          {},
          { $pull: { variations: { $in: mIds } } },
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
