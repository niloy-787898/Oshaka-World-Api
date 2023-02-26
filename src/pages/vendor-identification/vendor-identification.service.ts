import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model, Types} from 'mongoose';
import {ConfigService} from '@nestjs/config';
import {UtilsService} from '../../shared/utils/utils.service';
import {ResponsePayload} from '../../interfaces/core/response-payload.interface';
import {ErrorCodes} from '../../enum/error-code.enum';
import {VendorIdentification} from "../../interfaces/common/vendor-identification";
import {
  AddVendorIdentificationDto,
  FilterAndPaginationVendorIdentificationDto,
  OptionVendorIdentificationDto,
  UpdateVendorIdentificationDto
} from "../../dto/vendor-identification.dto";
import {Vendor} from "../../interfaces/user/vendor.interface";


const ObjectId = Types.ObjectId;

@Injectable()
export class VendorIdentificationService {
  private logger = new Logger(VendorIdentificationService.name);

  constructor(
    @InjectModel('VendorIdentification') private readonly vendorIdentificationModel: Model<VendorIdentification>,
    @InjectModel('Vendor') private readonly vendorModel: Model<Vendor>,
    private configService: ConfigService,
    private utilsService: UtilsService,
  ) {}

  /**
   * addVendorIdentification
   * insertManyVendorIdentification
   */
  async addVendorIdentification(id ,addVendorIdentificationDto: AddVendorIdentificationDto): Promise<ResponsePayload> {
    addVendorIdentificationDto={...addVendorIdentificationDto,...{vendor:id}};
    const newData = new this.vendorIdentificationModel(addVendorIdentificationDto);
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

  async insertManyVendorIdentification(
    addVendorIdentificationsDto: AddVendorIdentificationDto[],
    optionVendorIdentificationDto: OptionVendorIdentificationDto,
  ): Promise<ResponsePayload> {
    const { deleteMany } = optionVendorIdentificationDto;
    if (deleteMany) {
      await this.vendorIdentificationModel.deleteMany({});
    }
    const mData = addVendorIdentificationsDto.map((m) => {
      return {
        ...m,
        ...{
          slug: this.utilsService.transformToSlug(m.fullName),
        },
      };
    });
    try {
      const saveData = await this.vendorIdentificationModel.insertMany(mData);
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
   * getAllVendorIdentifications
   * getVendorIdentificationById
   */
  async getAllVendorIdentifications(
    filterVendorIdentificationDto: FilterAndPaginationVendorIdentificationDto,
    searchQuery?: string,
  ): Promise<ResponsePayload> {
    const { filter } = filterVendorIdentificationDto;
    const { pagination } = filterVendorIdentificationDto;
    const { sort } = filterVendorIdentificationDto;
    const { select } = filterVendorIdentificationDto;

    // Essential Variables
    const aggregateStages = [];
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
      aggregateStages.push({ $match: mFilter });
    }

    if (Object.keys(mSort).length) {
      aggregateStages.push({ $sort: mSort });
    }

    if (!pagination) {
      aggregateStages.push({ $project: mSelect });
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

      aggregateStages.push(mPagination);

      aggregateStages.push({
        $project: {
          data: 1,
          count: { $arrayElemAt: ['$metadata.total', 0] },
        },
      });
    }

    try {
      const dataAggregates = await this.vendorIdentificationModel.aggregate(aggregateStages);
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
        throw new InternalServerErrorException();
      }
    }
  }

  async getVendorIdentificationById(id: string, select: string): Promise<ResponsePayload> {
    try {
      const data = await this.vendorIdentificationModel.findById({vendor: id}).select(select);
      
      return {
        success: true,
        message: 'Success',
        data,
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async getUserVendorIdentificationById(id: string, select: string): Promise<ResponsePayload> {
    try {
      const data = await this.vendorIdentificationModel.findOne({vendor: new ObjectId(id)});
      console.log(data);
      console.log( id);
      
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
   * updateVendorIdentificationById
   * updateMultipleVendorIdentificationById
   */
  async updateVendorIdentificationById(
    id: string,
    updateVendorIdentificationDto: UpdateVendorIdentificationDto,
  ): Promise<ResponsePayload> {
    const { name } = updateVendorIdentificationDto;
    let data;
    try {
      data = await this.vendorIdentificationModel.findById(id);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
    if (!data) {
      throw new NotFoundException('No Data found!');
    }
    try {
      const finalData = { ...updateVendorIdentificationDto };
      // Check Slug
      if (name)
        if (name && data.name !== name) {
          finalData.slug = this.utilsService.transformToSlug(name, true);
        }

      await this.vendorIdentificationModel.findByIdAndUpdate(id, {
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

  async updateMultipleVendorIdentificationById(
    ids: string[],
    updateVendorIdentificationDto: UpdateVendorIdentificationDto,
  ): Promise<ResponsePayload> {
    const mIds = ids.map((m) => new ObjectId(m));

    // Delete No Multiple Action Data
    if (updateVendorIdentificationDto.slug) {
      delete updateVendorIdentificationDto.slug;
    }

    try {
      await this.vendorIdentificationModel.updateMany(
        { _id: { $in: mIds } },
        { $set: updateVendorIdentificationDto },
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
   * deleteVendorIdentificationById
   * deleteMultipleVendorIdentificationById
   */
  async deleteVendorIdentificationById(
    id: string,
    checkUsage: boolean,
  ): Promise<ResponsePayload> {
    let data;
    try {
      data = await this.vendorIdentificationModel.findById(id);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
    if (!data) {
      throw new NotFoundException('No Data found!');
    }
    if (data.readOnly) {
      throw new NotFoundException('Sorry! Read only data can not be deleted');
    }
    try {
      await this.vendorIdentificationModel.findByIdAndDelete(id);
      // Reset Product VendorIdentification Reference
      if (checkUsage) {
        const defaultVendorIdentification = await this.vendorIdentificationModel.findOne({
          readOnly: true,
        });
        const resetVendorIdentification = {
          vendorIdentification: {
            _id: defaultVendorIdentification._id,
            name: defaultVendorIdentification.vendorName,
          },
        };
        // Update Product
        await this.vendorModel.updateMany(
          { 'vendorIdentification._id': new ObjectId(id) },
          { $set: resetVendorIdentification },
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

  async deleteMultipleVendorIdentificationById(
    ids: string[],
    checkUsage: boolean,
  ): Promise<ResponsePayload> {
    try {
      const mIds = ids.map((m) => new ObjectId(m));
      await this.vendorIdentificationModel.deleteMany({ _id: mIds });
      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
