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
import { ContactUs } from '../../../interfaces/common/contact-us.interface';
import { ResponsePayload } from '../../../interfaces/core/response-payload.interface';
import { ErrorCodes } from '../../../enum/error-code.enum';
import {
  AddContactUsDto,
  FilterAndPaginationContactUsDto,
  OptionContactUsDto,
  UpdateContactUsDto,
} from '../../../dto/contact-us.dto';

const ObjectId = Types.ObjectId;

@Injectable()
export class ContactUsService {
  private logger = new Logger(ContactUsService.name);

  constructor(
    @InjectModel('ContactUs') private readonly contactUsModel: Model<ContactUs>,
  ) {}

  /**
   * addContactUs
   * insertManyContactUs
   */
  async addContactUs(
    addContactUsDto: AddContactUsDto,
  ): Promise<ResponsePayload> {
    const mData = { ...addContactUsDto };
    const newData = new this.contactUsModel(mData);
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

  async insertManyContactUs(
    addContactUssDto: AddContactUsDto[],
    optionContactUsDto: OptionContactUsDto,
  ): Promise<ResponsePayload> {
    const { deleteMany } = optionContactUsDto;
    if (deleteMany) {
      await this.contactUsModel.deleteMany({});
    }
    const mData = addContactUssDto.map((m) => {
      return {
        ...m,
      };
    });
    try {
      const saveData = await this.contactUsModel.insertMany(mData);
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
   * getAllContactUss
   * getContactUsById
   */
  async getAllContactUssBasic() {
    try {
      const pageSize = 10;
      const currentPage = 1;
      const data = await this.contactUsModel
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

  async getAllContactUss(
    filterContactUsDto: FilterAndPaginationContactUsDto,
    searchQuery?: string,
  ): Promise<ResponsePayload> {
    const { filter } = filterContactUsDto;
    const { pagination } = filterContactUsDto;
    const { sort } = filterContactUsDto;
    const { select } = filterContactUsDto;

    // Essential Variables
    const aggregateScontactUses = [];
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
      mFilter = { ...mFilter };
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
      aggregateScontactUses.push({ $match: mFilter });
    }

    if (Object.keys(mSort).length) {
      aggregateScontactUses.push({ $sort: mSort });
    }

    if (!pagination) {
      aggregateScontactUses.push({ $project: mSelect });
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

      aggregateScontactUses.push(mPagination);

      aggregateScontactUses.push({
        $project: {
          data: 1,
          count: { $arrayElemAt: ['$metadata.total', 0] },
        },
      });
    }

    try {
      const dataAggregates = await this.contactUsModel.aggregate(
        aggregateScontactUses,
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

  async getContactUsById(id: string, select: string): Promise<ResponsePayload> {
    try {
      const data = await this.contactUsModel.findById(id).select(select);
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
   * updateContactUsById
   * updateMultipleContactUsById
   */
  async updateContactUsById(
    id: string,
    updateContactUsDto: UpdateContactUsDto,
  ): Promise<ResponsePayload> {
    let data;
    try {
      data = await this.contactUsModel.findById(id);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
    if (!data) {
      throw new NotFoundException('No Data found!');
    }
    try {
      const finalData = { ...updateContactUsDto };
      await this.contactUsModel.findByIdAndUpdate(id, {
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

  async updateMultipleContactUsById(
    ids: string[],
    updateContactUsDto: UpdateContactUsDto,
  ): Promise<ResponsePayload> {
    const mIds = ids.map((m) => new ObjectId(m));

    try {
      await this.contactUsModel.updateMany(
        { _id: { $in: mIds } },
        { $set: updateContactUsDto },
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
   * deleteContactUsById
   * deleteMultipleContactUsById
   */
  async deleteContactUsById(id: string): Promise<ResponsePayload> {
    let data;
    try {
      data = await this.contactUsModel.findById(id);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
    if (!data) {
      throw new NotFoundException('No Data found!');
    }
    try {
      await this.contactUsModel.findByIdAndDelete(id);
      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async deleteMultipleContactUsById(ids: string[]): Promise<ResponsePayload> {
    try {
      const mIds = ids.map((m) => new ObjectId(m));
      await this.contactUsModel.deleteMany({ _id: ids });
      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
