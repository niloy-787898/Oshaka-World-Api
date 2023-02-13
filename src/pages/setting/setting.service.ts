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
import { Setting } from '../../interfaces/core/setting.interface';
import { ResponsePayload } from '../../interfaces/core/response-payload.interface';
import { ErrorCodes } from '../../enum/error-code.enum';
import {
  AddSettingDto,
  FilterAndPaginationSettingDto,
  OptionSettingDto,
  UpdateSettingDto,
} from '../../dto/setting.dto';

const ObjectId = Types.ObjectId;

@Injectable()
export class SettingService {
  private logger = new Logger(SettingService.name);

  constructor(
    @InjectModel('Setting') private readonly settingModel: Model<Setting>,
    private configService: ConfigService,
    private utilsService: UtilsService,
  ) {}

  /**
   * addSetting
   * insertManySetting
   */
  async addSetting(addSettingDto: AddSettingDto): Promise<ResponsePayload> {
    const mData = { ...addSettingDto };
    const newData = new this.settingModel(mData);
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

  async insertManySetting(
    addSettingsDto: AddSettingDto[],
    optionSettingDto: OptionSettingDto,
  ): Promise<ResponsePayload> {
    const { deleteMany } = optionSettingDto;
    if (deleteMany) {
      await this.settingModel.deleteMany({});
    }
    const mData = addSettingsDto.map((m) => {
      return {
        ...m,
      };
    });
    try {
      const saveData = await this.settingModel.insertMany(mData);
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
   * getAllSettings
   * getSettingById
   */
  async getAllSettingsBasic() {
    try {
      const pageSize = 10;
      const currentPage = 1;
      const data = await this.settingModel
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

  async getAllSettings(
    filterSettingDto: FilterAndPaginationSettingDto,
    searchQuery?: string,
  ): Promise<ResponsePayload> {
    const { filter } = filterSettingDto;
    const { pagination } = filterSettingDto;
    const { sort } = filterSettingDto;
    const { select } = filterSettingDto;

    // Essential Variables
    const aggregateSsettinges = [];
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
      aggregateSsettinges.push({ $match: mFilter });
    }

    if (Object.keys(mSort).length) {
      aggregateSsettinges.push({ $sort: mSort });
    }

    if (!pagination) {
      aggregateSsettinges.push({ $project: mSelect });
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

      aggregateSsettinges.push(mPagination);

      aggregateSsettinges.push({
        $project: {
          data: 1,
          count: { $arrayElemAt: ['$metadata.total', 0] },
        },
      });
    }

    try {
      const dataAggregates = await this.settingModel.aggregate(
        aggregateSsettinges,
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

  async getSettingById(id: string, select: string): Promise<ResponsePayload> {
    try {
      const data = await this.settingModel.findById(id).select(select);
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
   * updateSettingById
   * updateMultipleSettingById
   */
  async updateSettingById(
    id: string,
    updateSettingDto: UpdateSettingDto,
  ): Promise<ResponsePayload> {
    let data;
    try {
      data = await this.settingModel.findById(id);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
    if (!data) {
      throw new NotFoundException('No Data found!');
    }
    try {
      const finalData = { ...updateSettingDto };
      await this.settingModel.findByIdAndUpdate(id, {
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

  async updateMultipleSettingById(
    ids: string[],
    updateSettingDto: UpdateSettingDto,
  ): Promise<ResponsePayload> {
    const mIds = ids.map((m) => new ObjectId(m));

    // Delete No Multiple Action Data

    try {
      await this.settingModel.updateMany(
        { _id: { $in: mIds } },
        { $set: updateSettingDto },
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
   * deleteSettingById
   * deleteMultipleSettingById
   */
  async deleteSettingById(id: string): Promise<ResponsePayload> {
    let data;
    try {
      data = await this.settingModel.findById(id);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
    if (!data) {
      throw new NotFoundException('No Data found!');
    }
    try {
      await this.settingModel.findByIdAndDelete(id);
      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async deleteMultipleSettingById(ids: string[]): Promise<ResponsePayload> {
    try {
      const mIds = ids.map((m) => new ObjectId(m));
      await this.settingModel.deleteMany({ _id: ids });
      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
