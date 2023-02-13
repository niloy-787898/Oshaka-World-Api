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
import { FlashSale } from '../../../interfaces/common/flash-sale.interface';
import { ResponsePayload } from '../../../interfaces/core/response-payload.interface';
import { ErrorCodes } from '../../../enum/error-code.enum';
import {
  AddFlashSaleDto,
  FilterAndPaginationFlashSaleDto,
  OptionFlashSaleDto,
  UpdateFlashSaleDto,
} from '../../../dto/flash-sale.dto';

const ObjectId = Types.ObjectId;

@Injectable()
export class FlashSaleService {
  private logger = new Logger(FlashSaleService.name);

  constructor(
    @InjectModel('FlashSale') private readonly flashSaleModel: Model<FlashSale>,
    private configService: ConfigService,
    private utilsService: UtilsService,
  ) {}

  /**
   * addFlashSale
   * insertManyFlashSale
   */
  async addFlashSale(
    addFlashSaleDto: AddFlashSaleDto,
  ): Promise<ResponsePayload> {
    const { name } = addFlashSaleDto;

    const defaultData = {
      slug: this.utilsService.transformToSlug(name),
    };
    const mData = { ...addFlashSaleDto, ...defaultData };
    const newData = new this.flashSaleModel(mData);
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

  async insertManyFlashSale(
    addFlashSalesDto: AddFlashSaleDto[],
    optionFlashSaleDto: OptionFlashSaleDto,
  ): Promise<ResponsePayload> {
    const { deleteMany } = optionFlashSaleDto;
    if (deleteMany) {
      await this.flashSaleModel.deleteMany({});
    }
    const mData = addFlashSalesDto.map((m) => {
      return {
        ...m,
        ...{
          slug: this.utilsService.transformToSlug(m.name),
        },
      };
    });
    try {
      const saveData = await this.flashSaleModel.insertMany(mData);
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
   * getAllFlashSales
   * getFlashSaleById
   */
  async getAllFlashSalesBasic() {
    try {
      const pageSize = 10;
      const currentPage = 1;
      const data = await this.flashSaleModel
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

  async getAllFlashSales(
    filterFlashSaleDto: FilterAndPaginationFlashSaleDto,
    searchQuery?: string,
  ): Promise<ResponsePayload> {
    const { filter } = filterFlashSaleDto;
    const { pagination } = filterFlashSaleDto;
    const { sort } = filterFlashSaleDto;
    const { select } = filterFlashSaleDto;

    // Essential Variables
    const aggregateSflashSalees = [];
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
      aggregateSflashSalees.push({ $match: mFilter });
    }

    if (Object.keys(mSort).length) {
      aggregateSflashSalees.push({ $sort: mSort });
    }

    if (!pagination) {
      aggregateSflashSalees.push({ $project: mSelect });
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

      aggregateSflashSalees.push(mPagination);

      aggregateSflashSalees.push({
        $project: {
          data: 1,
          count: { $arrayElemAt: ['$metadata.total', 0] },
        },
      });
    }

    try {
      const dataAggregates = await this.flashSaleModel.aggregate(
        aggregateSflashSalees,
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

  async getFlashSaleById(id: string, select: string): Promise<ResponsePayload> {
    try {
      const data = await this.flashSaleModel.findById(id).select(select);
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
   * updateFlashSaleById
   * updateMultipleFlashSaleById
   */
  async updateFlashSaleById(
    id: string,
    updateFlashSaleDto: UpdateFlashSaleDto,
  ): Promise<ResponsePayload> {
    const { name } = updateFlashSaleDto;
    let data;
    try {
      data = await this.flashSaleModel.findById(id);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
    if (!data) {
      throw new NotFoundException('No Data found!');
    }
    try {
      const finalData = { ...updateFlashSaleDto };
      // Check Slug
      if (name)
        if (name && data.name !== name) {
          finalData.slug = this.utilsService.transformToSlug(name, true);
        }

      await this.flashSaleModel.findByIdAndUpdate(id, {
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

  async updateMultipleFlashSaleById(
    ids: string[],
    updateFlashSaleDto: UpdateFlashSaleDto,
  ): Promise<ResponsePayload> {
    const mIds = ids.map((m) => new ObjectId(m));

    // Delete No Multiple Action Data
    if (updateFlashSaleDto.slug) {
      delete updateFlashSaleDto.slug;
    }

    try {
      await this.flashSaleModel.updateMany(
        { _id: { $in: mIds } },
        { $set: updateFlashSaleDto },
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
   * deleteFlashSaleById
   * deleteMultipleFlashSaleById
   */
  async deleteFlashSaleById(id: string): Promise<ResponsePayload> {
    let data;
    try {
      data = await this.flashSaleModel.findById(id);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
    if (!data) {
      throw new NotFoundException('No Data found!');
    }
    try {
      await this.flashSaleModel.findByIdAndDelete(id);
      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async deleteMultipleFlashSaleById(ids: string[]): Promise<ResponsePayload> {
    try {
      const mIds = ids.map((m) => new ObjectId(m));
      await this.flashSaleModel.deleteMany({ _id: ids });
      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
