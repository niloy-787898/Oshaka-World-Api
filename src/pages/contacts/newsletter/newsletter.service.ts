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
import { Newsletter } from '../../../interfaces/common/newsletter.interface';
import { ResponsePayload } from '../../../interfaces/core/response-payload.interface';
import { ErrorCodes } from '../../../enum/error-code.enum';
import {
  AddNewsletterDto,
  FilterAndPaginationNewsletterDto,
  OptionNewsletterDto,
  UpdateNewsletterDto,
} from '../../../dto/newsletter.dto';
import { Product } from '../../../interfaces/common/product.interface';

const ObjectId = Types.ObjectId;

@Injectable()
export class NewsletterService {
  private logger = new Logger(NewsletterService.name);

  constructor(
    @InjectModel('Newsletter')
    private readonly newsletterModel: Model<Newsletter>,
    private configService: ConfigService,
    private utilsService: UtilsService,
  ) {}

  /**
   * addNewsletter
   * insertManyNewsletter
   */
  async addNewsletter(
    addNewsletterDto: AddNewsletterDto,
  ): Promise<ResponsePayload> {
    const mData = { ...addNewsletterDto };
    const newData = new this.newsletterModel(mData);
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

  async insertManyNewsletter(
    addNewslettersDto: AddNewsletterDto[],
    optionNewsletterDto: OptionNewsletterDto,
  ): Promise<ResponsePayload> {
    const { deleteMany } = optionNewsletterDto;
    if (deleteMany) {
      await this.newsletterModel.deleteMany({});
    }
    const mData = addNewslettersDto.map((m) => {
      return {
        ...m,
      };
    });
    try {
      const saveData = await this.newsletterModel.insertMany(mData);
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
   * getAllNewsletters
   * getNewsletterById
   */
  async getAllNewslettersBasic() {
    try {
      const pageSize = 10;
      const currentPage = 1;
      const data = await this.newsletterModel
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

  async getAllNewsletters(
    filterNewsletterDto: FilterAndPaginationNewsletterDto,
    searchQuery?: string,
  ): Promise<ResponsePayload> {
    const { filter } = filterNewsletterDto;
    const { pagination } = filterNewsletterDto;
    const { sort } = filterNewsletterDto;
    const { select } = filterNewsletterDto;

    // Essential Variables
    const aggregateSnewsletteres = [];
    let mFilter = {};
    let mSort = {};
    let mSelect = {};
    let mPagination = {};

    // Match
    if (filter) {
      if (filter.createdAt && typeof filter.createdAt === 'object') {
        filter.createdAt['$gte'] = new Date(filter.createdAt['$gte']);
        filter.createdAt['$lte'] = new Date(filter.createdAt['$lte']);
      }
      mFilter = { ...mFilter, ...filter };
    }
    if (searchQuery) {
      mFilter = { ...mFilter, ...{ email: new RegExp(searchQuery, 'i') } };
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
      aggregateSnewsletteres.push({ $match: mFilter });
    }

    if (Object.keys(mSort).length) {
      aggregateSnewsletteres.push({ $sort: mSort });
    }

    if (!pagination) {
      aggregateSnewsletteres.push({ $project: mSelect });
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

      aggregateSnewsletteres.push(mPagination);

      aggregateSnewsletteres.push({
        $project: {
          data: 1,
          count: { $arrayElemAt: ['$metadata.total', 0] },
        },
      });
    }

    try {
      const dataAggregates = await this.newsletterModel.aggregate(
        aggregateSnewsletteres,
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

  async getNewsletterById(
    id: string,
    select: string,
  ): Promise<ResponsePayload> {
    try {
      const data = await this.newsletterModel.findById(id).select(select);
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
   * updateNewsletterById
   * updateMultipleNewsletterById
   */
  async updateNewsletterById(
    id: string,
    updateNewsletterDto: UpdateNewsletterDto,
  ): Promise<ResponsePayload> {
    let data;
    try {
      data = await this.newsletterModel.findById(id);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
    if (!data) {
      throw new NotFoundException('No Data found!');
    }
    try {
      const finalData = { ...updateNewsletterDto };
      // Check Slug
      await this.newsletterModel.findByIdAndUpdate(id, {
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

  async updateMultipleNewsletterById(
    ids: string[],
    updateNewsletterDto: UpdateNewsletterDto,
  ): Promise<ResponsePayload> {
    const mIds = ids.map((m) => new ObjectId(m));

    // Delete No Multiple Action Data
    try {
      await this.newsletterModel.updateMany(
        { _id: { $in: mIds } },
        { $set: updateNewsletterDto },
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
   * deleteNewsletterById
   * deleteMultipleNewsletterById
   */
  async deleteNewsletterById(id: string): Promise<ResponsePayload> {
    let data;
    try {
      data = await this.newsletterModel.findById(id);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
    if (!data) {
      throw new NotFoundException('No Data found!');
    }
    try {
      await this.newsletterModel.findByIdAndDelete(id);
      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async deleteMultipleNewsletterById(ids: string[]): Promise<ResponsePayload> {
    try {
      const mIds = ids.map((m) => new ObjectId(m));
      await this.newsletterModel.deleteMany({ _id: ids });
      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
