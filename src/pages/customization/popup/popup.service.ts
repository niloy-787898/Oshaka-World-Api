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
import { Popup } from '../../../interfaces/common/popup.interface';
import { ResponsePayload } from '../../../interfaces/core/response-payload.interface';
import { ErrorCodes } from '../../../enum/error-code.enum';
import {
  AddPopupDto,
  FilterAndPaginationPopupDto,
  OptionPopupDto,
  UpdatePopupDto,
} from '../../../dto/popup.dto';

const ObjectId = Types.ObjectId;

@Injectable()
export class PopupService {
  private logger = new Logger(PopupService.name);

  constructor(
    @InjectModel('Popup') private readonly popupModel: Model<Popup>,
    private configService: ConfigService,
    private utilsService: UtilsService,
  ) {}

  /**
   * addPopup
   * insertManyPopup
   */
  async addPopup(addPopupDto: AddPopupDto): Promise<ResponsePayload> {
    const { title } = addPopupDto;

    const defaultData = {
      url: this.utilsService.transformToSlug(title),
    };
    const mData = { ...addPopupDto, ...defaultData };
    const newData = new this.popupModel(mData);
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

  async insertManyPopup(
    addPopupsDto: AddPopupDto[],
    optionPopupDto: OptionPopupDto,
  ): Promise<ResponsePayload> {
    const { deleteMany } = optionPopupDto;
    if (deleteMany) {
      await this.popupModel.deleteMany({});
    }
    const mData = addPopupsDto.map((m) => {
      return {
        ...m,
        ...{
          url: this.utilsService.transformToSlug(m.title),
        },
      };
    });
    try {
      const saveData = await this.popupModel.insertMany(mData);
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
   * getAllPopups
   * getPopupById
   */
  async getAllPopupsBasic() {
    try {
      const pageSize = 10;
      const currentPage = 1;
      const data = await this.popupModel
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

  async getAllPopups(
    filterPopupDto: FilterAndPaginationPopupDto,
    searchQuery?: string,
  ): Promise<ResponsePayload> {
    const { filter } = filterPopupDto;
    const { pagination } = filterPopupDto;
    const { sort } = filterPopupDto;
    const { select } = filterPopupDto;

    // Essential Variables
    const aggregateSpopupes = [];
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
      aggregateSpopupes.push({ $match: mFilter });
    }

    if (Object.keys(mSort).length) {
      aggregateSpopupes.push({ $sort: mSort });
    }

    if (!pagination) {
      aggregateSpopupes.push({ $project: mSelect });
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

      aggregateSpopupes.push(mPagination);

      aggregateSpopupes.push({
        $project: {
          data: 1,
          count: { $arrayElemAt: ['$metadata.total', 0] },
        },
      });
    }

    try {
      const dataAggregates = await this.popupModel.aggregate(aggregateSpopupes);
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

  async getPopupById(id: string, select: string): Promise<ResponsePayload> {
    try {
      const data = await this.popupModel.findById(id).select(select);
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
   * updatePopupById
   * updateMultiplePopupById
   */
  async updatePopupById(
    id: string,
    updatePopupDto: UpdatePopupDto,
  ): Promise<ResponsePayload> {
    const { title } = updatePopupDto;
    let data;
    try {
      data = await this.popupModel.findById(id);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
    if (!data) {
      throw new NotFoundException('No Data found!');
    }
    try {
      const finalData = { ...updatePopupDto };
      // Check Slug
      if (title)
        if (title && data.title !== title) {
          finalData.url = this.utilsService.transformToSlug(title, true);
        }

      await this.popupModel.findByIdAndUpdate(id, {
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

  async updateMultiplePopupById(
    ids: string[],
    updatePopupDto: UpdatePopupDto,
  ): Promise<ResponsePayload> {
    const mIds = ids.map((m) => new ObjectId(m));

    // Delete No Multiple Action Data
    if (updatePopupDto.url) {
      delete updatePopupDto.url;
    }

    try {
      await this.popupModel.updateMany(
        { _id: { $in: mIds } },
        { $set: updatePopupDto },
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
   * deletePopupById
   * deleteMultiplePopupById
   */
  async deletePopupById(id: string): Promise<ResponsePayload> {
    let data;
    try {
      data = await this.popupModel.findById(id);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
    if (!data) {
      throw new NotFoundException('No Data found!');
    }
    try {
      await this.popupModel.findByIdAndDelete(id);
      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async deleteMultiplePopupById(ids: string[]): Promise<ResponsePayload> {
    try {
      const mIds = ids.map((m) => new ObjectId(m));
      await this.popupModel.deleteMany({ _id: ids });
      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
