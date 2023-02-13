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
import { DealOnPlay } from '../../../interfaces/common/deal-on-play.interface';
import { ResponsePayload } from '../../../interfaces/core/response-payload.interface';
import { ErrorCodes } from '../../../enum/error-code.enum';
import {
  AddDealOnPlayDto,
  FilterAndPaginationDealOnPlayDto,
  OptionDealOnPlayDto,
  UpdateDealOnPlayDto,
} from '../../../dto/deal-on-play.dto';
import { Product } from '../../../interfaces/common/product.interface';

const ObjectId = Types.ObjectId;

@Injectable()
export class DealOnPlayService {
  private logger = new Logger(DealOnPlayService.name);

  constructor(
    @InjectModel('DealOnPlay')
    private readonly dealOnPlayModel: Model<DealOnPlay>,
    private configService: ConfigService,
    private utilsService: UtilsService,
  ) {}

  /**
   * addDealOnPlay
   * insertManyDealOnPlay
   */
  async addDealOnPlay(
    addDealOnPlayDto: AddDealOnPlayDto,
  ): Promise<ResponsePayload> {
    const { name } = addDealOnPlayDto;

    const defaultData = {
      slug: this.utilsService.transformToSlug(name),
    };
    const mData = { ...addDealOnPlayDto, ...defaultData };
    const newData = new this.dealOnPlayModel(mData);
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

  async insertManyDealOnPlay(
    addDealOnPlaysDto: AddDealOnPlayDto[],
    optionDealOnPlayDto: OptionDealOnPlayDto,
  ): Promise<ResponsePayload> {
    const { deleteMany } = optionDealOnPlayDto;
    if (deleteMany) {
      await this.dealOnPlayModel.deleteMany({});
    }
    const mData = addDealOnPlaysDto.map((m) => {
      return {
        ...m,
        ...{
          slug: this.utilsService.transformToSlug(m.name),
        },
      };
    });
    try {
      const saveData = await this.dealOnPlayModel.insertMany(mData);
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
   * getAllDealOnPlays
   * getDealOnPlayById
   */
  async getAllDealOnPlaysBasic() {
    try {
      const pageSize = 10;
      const currentPage = 1;
      const data = await this.dealOnPlayModel
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

  async getAllDealOnPlays(
    filterDealOnPlayDto: FilterAndPaginationDealOnPlayDto,
    searchQuery?: string,
  ): Promise<ResponsePayload> {
    const { filter } = filterDealOnPlayDto;
    const { pagination } = filterDealOnPlayDto;
    const { sort } = filterDealOnPlayDto;
    const { select } = filterDealOnPlayDto;

    // Essential Variables
    const aggregateSdealOnPlayes = [];
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
      mSelect = { title: 1 };
    }

    // Finalize
    if (Object.keys(mFilter).length) {
      aggregateSdealOnPlayes.push({ $match: mFilter });
    }

    if (Object.keys(mSort).length) {
      aggregateSdealOnPlayes.push({ $sort: mSort });
    }

    if (!pagination) {
      aggregateSdealOnPlayes.push({ $project: mSelect });
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

      aggregateSdealOnPlayes.push(mPagination);

      aggregateSdealOnPlayes.push({
        $project: {
          data: 1,
          count: { $arrayElemAt: ['$metadata.total', 0] },
        },
      });
    }

    try {
      const dataAggregates = await this.dealOnPlayModel.aggregate(
        aggregateSdealOnPlayes,
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

  async getDealOnPlayById(
    id: string,
    select: string,
  ): Promise<ResponsePayload> {
    try {
      const data = await this.dealOnPlayModel.findById(id).select(select);
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
   * updateDealOnPlayById
   * updateMultipleDealOnPlayById
   */
  async updateDealOnPlayById(
    id: string,
    updateDealOnPlayDto: UpdateDealOnPlayDto,
  ): Promise<ResponsePayload> {
    const { name } = updateDealOnPlayDto;
    let data;
    try {
      data = await this.dealOnPlayModel.findById(id);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
    if (!data) {
      throw new NotFoundException('No Data found!');
    }
    try {
      const finalData = { ...updateDealOnPlayDto };
      // Check Slug
      if (name)
        if (name && data.title !== name) {
          finalData.slug = this.utilsService.transformToSlug(name, true);
        }

      await this.dealOnPlayModel.findByIdAndUpdate(id, {
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

  async updateMultipleDealOnPlayById(
    ids: string[],
    updateDealOnPlayDto: UpdateDealOnPlayDto,
  ): Promise<ResponsePayload> {
    const mIds = ids.map((m) => new ObjectId(m));

    // Delete No Multiple Action Data
    if (updateDealOnPlayDto.slug) {
      delete updateDealOnPlayDto.slug;
    }

    try {
      await this.dealOnPlayModel.updateMany(
        { _id: { $in: mIds } },
        { $set: updateDealOnPlayDto },
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
   * deleteDealOnPlayById
   * deleteMultipleDealOnPlayById
   */
  async deleteDealOnPlayById(id: string): Promise<ResponsePayload> {
    let data;
    try {
      data = await this.dealOnPlayModel.findById(id);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
    if (!data) {
      throw new NotFoundException('No Data found!');
    }
    try {
      await this.dealOnPlayModel.findByIdAndDelete(id);
      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async deleteMultipleDealOnPlayById(ids: string[]): Promise<ResponsePayload> {
    try {
      const mIds = ids.map((m) => new ObjectId(m));
      await this.dealOnPlayModel.deleteMany({ _id: ids });
      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
