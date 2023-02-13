/* eslint-disable prettier/prettier */
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
import { ResponsePayload } from '../../../interfaces/core/response-payload.interface';
import { ErrorCodes } from '../../../enum/error-code.enum';
import { Product } from '../../../interfaces/common/product.interface';
import { PromoOffer } from '../../../interfaces/common/promo-offer.interface';
import {
  AddPromoOfferDto,
  FilterAndPaginationPromoOfferDto,
  OptionPromoOfferDto,
  UpdatePromoOfferDto,
} from '../../../dto/promo-offer.dto';
import { JobSchedulerService } from '../../../shared/job-scheduler/job-scheduler.service';

const ObjectId = Types.ObjectId;

@Injectable()
export class PromoOfferService {
  private logger = new Logger(PromoOfferService.name);

  constructor(
    @InjectModel('PromoOffer')
    private readonly promoOfferModel: Model<PromoOffer>,
    @InjectModel('Product') private readonly productModel: Model<Product>,
    private configService: ConfigService,
    private utilsService: UtilsService,
    private jobSchedulerService: JobSchedulerService,
  ) {}

  /**
   * addPromoOffer
   * insertManyPromoOffer
   */
  async addPromoOffer(
    addPromoOfferDto: AddPromoOfferDto,
  ): Promise<ResponsePayload> {
    try {
      const { title } = addPromoOfferDto;
      const { products } = addPromoOfferDto;
      const { startDateTime } = addPromoOfferDto;
      const { endDateTime } = addPromoOfferDto;

      // Check Single Document
      // const checkData = await this.promoOfferModel.findOne();
      // if (checkData) {
      //   return {
      //     success: false,
      //     message: 'Data Cannot be Added. Its a Single Document Collection',
      //     data: null,
      //   } as ResponsePayload;
      // }

      const defaultData = {
        slug: this.utilsService.transformToSlug(title),
      };
      const mData = { ...addPromoOfferDto, ...defaultData };
      const newData = new this.promoOfferModel(mData);
      const saveData = await newData.save();

      /**
       * SCHEDULE DATE
       */
      const isStartDate = this.utilsService.getDateDifference(
        new Date(),
        new Date(startDateTime),
        'seconds',
      );

      const isEndDate = this.utilsService.getDateDifference(
        new Date(),
        new Date(endDateTime),
        'seconds',
      );

      if (isEndDate <= 0) {
        return {
          success: false,
          message: 'Data can not be added. Expire date is wrong',
        } as ResponsePayload;
      } else {
        this.jobSchedulerService.addOfferScheduleOnEnd(
          true,
          saveData._id,
          endDateTime,
          products,
        );
      }

      if (isStartDate <= 0) {
        console.log("--------")
        // // Update Product Collection
        // await this.utilsService.updateProductsOnOfferStart(products);

      } else {
        this.jobSchedulerService.addOfferScheduleOnStart(
          true,
          saveData._id,
          startDateTime,
          products,
        );
      }

      return {
        success: true,
        message: 'Data Added Success',
        // data,
      } as ResponsePayload;
    } catch (error) {
      console.log(error);
      if (error.code && error.code.toString() === ErrorCodes.UNIQUE_FIELD) {
        throw new ConflictException('Slug Must be Unique');
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }

  async insertManyPromoOffer(
    addPromoOffersDto: AddPromoOfferDto[],
    optionPromoOfferDto: OptionPromoOfferDto,
  ): Promise<ResponsePayload> {
    const { deleteMany } = optionPromoOfferDto;
    if (deleteMany) {
      await this.promoOfferModel.deleteMany({});
    }
    const mData = addPromoOffersDto.map((m) => {
      return {
        ...m,
        ...{
          slug: this.utilsService.transformToSlug(m.title),
        },
      };
    });
    try {
      const saveData = await this.promoOfferModel.insertMany(mData);
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
   * getAllPromoOffers
   * getPromoOfferById
   */
  async getAllPromoOffers(
    filterPromoOfferDto: FilterAndPaginationPromoOfferDto,
    searchQuery?: string,
  ): Promise<ResponsePayload> {
    const { filter } = filterPromoOfferDto;
    const { pagination } = filterPromoOfferDto;
    const { sort } = filterPromoOfferDto;
    const { select } = filterPromoOfferDto;
    try {
      const data = await this.promoOfferModel
          .find()
          .select(select);

      return {
        success: true,
        message: 'Success',
        data,
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async getPromoOfferById(
    id: string,
    select: string,
  ): Promise<ResponsePayload> {
    try {
      const data = await this.promoOfferModel
        .findById(id)
        .select(select);

      return {
        success: true,
        message: 'Success',
        data,
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async getPromoOfferBySlug(
    slug: string,
    select: string,
  ): Promise<ResponsePayload> {
    try {
      const data = await this.promoOfferModel.
      findOne({ slug });

      return {
        success: true,
        message: 'Success',
        data,
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async getProductByOfferSlugAndProductSlug(
      promoSlug: string,
      productSlug: string,
  ): Promise<ResponsePayload> {
    try {
      const data: any = await this.promoOfferModel.
      findOne({ slug:promoSlug, 'products.slug':productSlug}).select('products')

      const retrunData: Product[] = data.products.filter((m)=> {
        if(m.product.slug === productSlug)
          return m
      });
      data.products = retrunData[0];
      return {
        success: true,
        message: 'Success',
        data,
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async getPromoOfferSingle(select?: string): Promise<ResponsePayload> {
    try {
      const data = await this.promoOfferModel
        .findOne({})
        .select(select ? select : '');

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
   * updatePromoOfferById
   * updateMultiplePromoOfferById
   */
  async updatePromoOfferById(
    id: string,
    updatePromoOfferDto: UpdatePromoOfferDto,
  ): Promise<ResponsePayload> {
    try {
      const { title } = updatePromoOfferDto;
      const { products } = updatePromoOfferDto;
      const { startDateTime } = updatePromoOfferDto;
      const { endDateTime } = updatePromoOfferDto;

      const data = await this.promoOfferModel.findById(id);

      const finalData = { ...updatePromoOfferDto };
      // Check Slug
      if (title) {
        if (title && data.title !== title) {
          finalData.slug = this.utilsService.transformToSlug(title, true);
        }
      }

      // CANCEL EXISTING JOB SCHEDULE
      const jobNameStart = this.configService.get<string>(
        'promoOfferScheduleOnStart',
      );
      const jobNameEnd = this.configService.get<string>(
        'promoOfferScheduleOnEnd',
      );
      await this.jobSchedulerService.cancelOfferJobScheduler(jobNameStart);
      await this.jobSchedulerService.cancelOfferJobScheduler(jobNameEnd);

      /**
       * NEW SCHEDULE DATE
       */
      const isStartDate = this.utilsService.getDateDifference(
        new Date(),
        new Date(startDateTime),
        'seconds',
      );

      const isEndDate = this.utilsService.getDateDifference(
        new Date(),
        new Date(endDateTime),
        'seconds',
      );

      if (isEndDate <= 0) {
        console.log('isEndDate is past date');
        return {
          success: false,
          message: 'Data can not be added. Expire date is wrong',
        } as ResponsePayload;
      } else {
        console.log('isEndDate is future date');
        this.jobSchedulerService.addOfferScheduleOnEnd(
          true,
          id,
          endDateTime,
          products,
        );
      }

      if (isStartDate <= 0) {
        console.log('isStartDate is past date');
        // Update Product Collection
        // await this.utilsService.updateProductsOnOfferStart(products);
      } else {
        console.log('isStartDate is future date');
        this.jobSchedulerService.addOfferScheduleOnStart(
          true,
          id,
          startDateTime,
          products,
        );
      }

      await this.promoOfferModel.findByIdAndUpdate(id, {
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

  async updateMultiplePromoOfferById(
    ids: string[],
    updatePromoOfferDto: UpdatePromoOfferDto,
  ): Promise<ResponsePayload> {
    const mIds = ids.map((m) => new ObjectId(m));

    // Delete No Multiple Action Data
    if (updatePromoOfferDto.slug) {
      delete updatePromoOfferDto.slug;
    }

    try {
      await this.promoOfferModel.updateMany(
        { _id: { $in: mIds } },
        { $set: updatePromoOfferDto },
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
   * deletePromoOfferById
   * deleteMultiplePromoOfferById
   */
  async deletePromoOfferById(
    id: string,
    checkUsage: boolean,
  ): Promise<ResponsePayload> {
    let data;
    try {
      data = await this.promoOfferModel.findById(id);
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
      const defaultPromoOffer = await this.promoOfferModel.findOne({
        _id: id,
      });

      await this.promoOfferModel.findByIdAndDelete(id);

      const productIds = defaultPromoOffer
        ? defaultPromoOffer.products.map((m) => new ObjectId(m))
        : [];

      let resetData = {
        discountStartDateTime: null,
        discountEndDateTime: null,
      };

      if (checkUsage) {
        resetData = {
          ...resetData,
          ...{
            discountType: null,
            discountAmount: null,
          },
        };
      }
      // Update Product
      await this.productModel.updateMany(
        { _id: { $in: productIds } },
        { $set: resetData },
      );
      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async deleteMultiplePromoOfferById(
    ids: string[],
    checkUsage: boolean,
  ): Promise<ResponsePayload> {
    try {
      const mIds = ids.map((m) => new ObjectId(m));
      // Remove Read Only Data
      const allCategory = await this.promoOfferModel.find({
        _id: { $in: mIds },
      });

      await this.promoOfferModel.deleteMany({ _id: mIds });
      // Reset Product PromoOffer Reference
      const mProductsIds = [];

      allCategory.forEach((f) => {
        f.products.forEach((g) => {
          mProductsIds.push(g);
        });
      });
      const productIds = mProductsIds.map((m) => new ObjectId(m));

      let resetData = {
        discountStartDateTime: null,
        discountEndDateTime: null,
      };

      // CANCEL EXISTING JOB SCHEDULE
      const jobNameStart = this.configService.get<string>(
        'promoOfferScheduleOnStart',
      );
      const jobNameEnd = this.configService.get<string>(
        'promoOfferScheduleOnEnd',
      );
      await this.jobSchedulerService.cancelOfferJobScheduler(jobNameStart);
      await this.jobSchedulerService.cancelOfferJobScheduler(jobNameEnd);

      if (checkUsage) {
        resetData = {
          ...resetData,
          ...{
            discountType: null,
            discountAmount: null,
          },
        };
      }
      // Update Product
      await this.productModel.updateMany(
        { _id: { $in: productIds } },
        { $set: resetData },
      );
      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
