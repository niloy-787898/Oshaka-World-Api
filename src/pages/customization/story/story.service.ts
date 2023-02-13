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
import { Story } from '../../../interfaces/common/story.interface';
import { ResponsePayload } from '../../../interfaces/core/response-payload.interface';
import { ErrorCodes } from '../../../enum/error-code.enum';
import {
  AddStoryDto,
  FilterAndPaginationStoryDto,
  OptionStoryDto,
  UpdateStoryDto,
} from '../../../dto/story.dto';

const ObjectId = Types.ObjectId;

@Injectable()
export class StoryService {
  private logger = new Logger(StoryService.name);

  constructor(
    @InjectModel('Story') private readonly storyModel: Model<Story>,
    private configService: ConfigService,
    private utilsService: UtilsService,
  ) {}

  /**
   * addStory
   * insertManyStory
   */
  async addStory(addStoryDto: AddStoryDto): Promise<ResponsePayload> {
    const { title } = addStoryDto;

    const defaultData = {
      url: this.utilsService.transformToSlug(title),
    };
    const mData = { ...addStoryDto, ...defaultData };
    const newData = new this.storyModel(mData);
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

  async insertManyStory(
    addStorysDto: AddStoryDto[],
    optionStoryDto: OptionStoryDto,
  ): Promise<ResponsePayload> {
    const { deleteMany } = optionStoryDto;
    if (deleteMany) {
      await this.storyModel.deleteMany({});
    }
    const mData = addStorysDto.map((m) => {
      return {
        ...m,
        ...{
          url: this.utilsService.transformToSlug(m.title),
        },
      };
    });
    try {
      const saveData = await this.storyModel.insertMany(mData);
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
   * getAllStorys
   * getStoryById
   */
  async getAllStorysBasic() {
    try {
      const pageSize = 10;
      const currentPage = 1;
      const data = await this.storyModel
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

  async getAllStorys(
    filterStoryDto: FilterAndPaginationStoryDto,
    searchQuery?: string,
  ): Promise<ResponsePayload> {
    const { filter } = filterStoryDto;
    const { pagination } = filterStoryDto;
    const { sort } = filterStoryDto;
    const { select } = filterStoryDto;

    // Essential Variables
    const aggregateSstoryes = [];
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
      aggregateSstoryes.push({ $match: mFilter });
    }

    if (Object.keys(mSort).length) {
      aggregateSstoryes.push({ $sort: mSort });
    }

    if (!pagination) {
      aggregateSstoryes.push({ $project: mSelect });
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

      aggregateSstoryes.push(mPagination);

      aggregateSstoryes.push({
        $project: {
          data: 1,
          count: { $arrayElemAt: ['$metadata.total', 0] },
        },
      });
    }

    try {
      const dataAggregates = await this.storyModel.aggregate(aggregateSstoryes);
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

  async getStoryById(id: string, select: string): Promise<ResponsePayload> {
    try {
      const data = await this.storyModel.findById(id).select(select);
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
   * updateStoryById
   * updateMultipleStoryById
   */
  async updateStoryById(
    id: string,
    updateStoryDto: UpdateStoryDto,
  ): Promise<ResponsePayload> {
    const { title } = updateStoryDto;
    let data;
    try {
      data = await this.storyModel.findById(id);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
    if (!data) {
      throw new NotFoundException('No Data found!');
    }
    try {
      const finalData = { ...updateStoryDto };
      // Check Slug
      if (title)
        if (title && data.title !== title) {
          finalData.url = this.utilsService.transformToSlug(title, true);
        }

      await this.storyModel.findByIdAndUpdate(id, {
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

  async updateMultipleStoryById(
    ids: string[],
    updateStoryDto: UpdateStoryDto,
  ): Promise<ResponsePayload> {
    const mIds = ids.map((m) => new ObjectId(m));

    // Delete No Multiple Action Data
    if (updateStoryDto.url) {
      delete updateStoryDto.url;
    }

    try {
      await this.storyModel.updateMany(
        { _id: { $in: mIds } },
        { $set: updateStoryDto },
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
   * deleteStoryById
   * deleteMultipleStoryById
   */
  async deleteStoryById(id: string): Promise<ResponsePayload> {
    let data;
    try {
      data = await this.storyModel.findById(id);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
    if (!data) {
      throw new NotFoundException('No Data found!');
    }
    try {
      await this.storyModel.findByIdAndDelete(id);
      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async deleteMultipleStoryById(ids: string[]): Promise<ResponsePayload> {
    try {
      const mIds = ids.map((m) => new ObjectId(m));
      await this.storyModel.deleteMany({ _id: ids });
      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
