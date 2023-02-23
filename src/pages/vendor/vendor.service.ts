import {
  BadRequestException,
  CACHE_MANAGER,
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import {
  Vendor,
  VendorAuthResponse,
  VendorJwtPayload,
} from '../../interfaces/user/vendor.interface';

import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { ErrorCodes } from '../../enum/error-code.enum';

import { ResponsePayload } from '../../interfaces/core/response-payload.interface';
import {
  AddAddressDto,
  AuthSocialVendorDto,
  AuthVendorDto,
  CheckVendorDto,
  CheckVendorRegistrationDto,
  CreateSocialVendorDto,
  CreateVendorDto,
  FilterAndPaginationVendorDto,
  ResetPasswordDto,
  UpdateAddressDto,
  UpdateVendorDto,
  VendorSelectFieldDto,
} from '../../dto/vendor.dto';
import { AdminAuthResponse } from '../../interfaces/admin/admin.interface';
// import { ChangePasswordDto } from '../../dto/change-password.dto';
import { Cache } from 'cache-manager';
import { UtilsService } from '../../shared/utils/utils.service';
import { OtpService } from '../otp/otp.service';
import { VendorIdentification } from 'src/interfaces/common/vendor-identification';

const ObjectId = Types.ObjectId;

@Injectable()
export class VendorService {
  private logger = new Logger(VendorService.name);
  // Cache
  private readonly cacheAllData = 'getAllVendor';
  private readonly cacheDataCount = 'getCountVendor';

  constructor(
    @InjectModel('Vendor') private readonly vendorModel: Model<Vendor>,
    protected jwtService: JwtService,
    private configService: ConfigService,
    private utilsService: UtilsService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    protected otpService: OtpService,
  ) { }

  /**
   * Vendor Signup
   * Vendor Login
   * Vendor Signup & Login
   * checkVendorForRegistration()
   */
  async vendorSignup(createVendorDto: CreateVendorDto): Promise<ResponsePayload> {
    const { password } = createVendorDto;
    const salt = await bcrypt.genSalt();
    const hashedPass = await bcrypt.hash('password', salt);

    const mData = {
      ...createVendorDto,
      ...{ password: hashedPass, vendorName: createVendorDto.phoneNo },
    };
    const newVendor = new this.vendorModel(mData);
    try {
      const saveData = await newVendor.save();
      // Cache Removed
      await this.cacheManager.del(this.cacheAllData);
      await this.cacheManager.del(this.cacheDataCount);

      return {
        success: true,
        message: 'Success',
        data: saveData._id
      } as ResponsePayload;
    } catch (error) {
      console.log(error);
      if (error.code && error.code.toString() === ErrorCodes.UNIQUE_FIELD) {
        throw new ConflictException('VendorName already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async vendorLogin(authVendorDto: AuthVendorDto): Promise<VendorAuthResponse> {
    try {
      const vendor = (await this.vendorModel
        .findOne({ vendorName: authVendorDto.vendorName })
        .select('password vendorName approved')) as Vendor;

      if (!vendor) {
        return {
          success: false,
          message: 'This phone no is not registered!',
        } as VendorAuthResponse;
      }

      if (!vendor.approved) {
        return {
          success: false,
          message: 'No Access for Login',
        } as AdminAuthResponse;
      }

      const payload: VendorJwtPayload = {
        _id: vendor._id,
        vendorName: vendor.vendorName,
      };

      const accessToken = this.jwtService.sign(payload);
      return {
        success: true,
        message: 'Login success!',
        data: {
          _id: vendor._id,
        },
        token: accessToken,
        tokenExpiredIn: this.configService.get<number>(
          'vendorTokenExpiredTime',
        ),
      } as VendorAuthResponse;
    } catch (error) {
      console.log(error);
      if (error.code && error.code.toString() === ErrorCodes.UNIQUE_FIELD) {
        throw new ConflictException('Vendorname already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async vendorLoginSocial(
    authVendorDto: AuthSocialVendorDto,
  ): Promise<VendorAuthResponse> {
    try {
      const vendor = (await this.vendorModel
        .findOne({ vendorName: authVendorDto.vendorName })
        .select('vendorName approved')) as Vendor;

      if (!vendor) {
        return {
          success: false,
          message: 'No vendor data found!',
        } as VendorAuthResponse;
      }

      if (!vendor.approved) {
        return {
          success: false,
          message: 'No Access for Login',
        } as AdminAuthResponse;
      }

      const payload: VendorJwtPayload = {
        _id: vendor._id,
        vendorName: vendor.vendorName,
      };
      const accessToken = this.jwtService.sign(payload);
      return {
        success: true,
        message: 'Login success!',
        data: {
          _id: vendor._id,
        },
        token: accessToken,
        tokenExpiredIn: this.configService.get<number>(
          'vendorTokenExpiredTime',
        ),
      } as VendorAuthResponse;
    } catch (error) {
      console.log(error);
      if (error.code && error.code.toString() === ErrorCodes.UNIQUE_FIELD) {
        throw new ConflictException('vendorName already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async vendorSignupAndLogin(
    createVendorDto: CreateVendorDto,
  ): Promise<VendorAuthResponse> {
    try {
      const vendorData = await this.vendorModel.findOne({
        vendorName: createVendorDto.phoneNo,
      });
      if (vendorData) {
        return {
          success: false,
          message: 'Sorry! Phone no is already registered. Please Login',
          data: null,
          token: null,
          tokenExpiredIn: null,
        } as VendorAuthResponse;
      } else {
        const { password } = createVendorDto;
        const salt = await bcrypt.genSalt();
        const hashedPass = await bcrypt.hash('password', salt);

        const mData = {
          ...createVendorDto,
          ...{ password: hashedPass, vendorName: createVendorDto.phoneNo },
        };
        const newVendor = new this.vendorModel(mData);

        const saveData = await newVendor.save();
        const authVendorDto: AuthVendorDto = {
          vendorName: newVendor.phoneNo,
          password: 'password',
        };
        // Cache Removed
        await this.cacheManager.del(this.cacheAllData);
        await this.cacheManager.del(this.cacheDataCount);

        return this.vendorLogin(authVendorDto);
      }
    } catch (error) {
      console.log(error);
      if (error.code && error.code.toString() === ErrorCodes.UNIQUE_FIELD) {
        throw new ConflictException('Vendorname already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async vendorSignupAndLoginSocial(
    createVendorDto: CreateSocialVendorDto,
  ): Promise<VendorAuthResponse> {
    try {
      this.logger.warn(createVendorDto);

      const vendorData = await this.vendorModel.findOne({
        vendorName: createVendorDto.vendorName,
      });

      if (vendorData) {
        if (createVendorDto.name) {
          await this.vendorModel.findOneAndUpdate(
            { _id: vendorData._id },
            {
              name: createVendorDto.name,
            },
          );
        }
        const authVendorDto: AuthSocialVendorDto = {
          vendorName: vendorData.vendorName,
        };
        return this.vendorLoginSocial(authVendorDto);
      } else {
        const newVendor = new this.vendorModel({
          ...createVendorDto,
          ...{ hasAccess: true },
        });

        const saveData = await newVendor.save();
        const authVendorDto: AuthSocialVendorDto = {
          vendorName: saveData.vendorName,
        };

        // Cache Removed
        await this.cacheManager.del(this.cacheAllData);
        await this.cacheManager.del(this.cacheDataCount);

        return this.vendorLoginSocial(authVendorDto);
      }
    } catch (error) {
      console.log(error);
      if (error.code && error.code.toString() === ErrorCodes.UNIQUE_FIELD) {
        throw new ConflictException('vendorName already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async checkVendorForRegistration(
    checkVendorRegistrationDto: CheckVendorRegistrationDto,
  ): Promise<ResponsePayload> {
    try {
      const vendorData = await this.vendorModel.findOne({
        vendorName: checkVendorRegistrationDto.phoneNo,
      });
      if (vendorData) {
        await this.otpService.generateOtpWithPhoneNo({
          phoneNo: checkVendorRegistrationDto.phoneNo,
        });
        return {
          success: true,
          message: 'Success! Otp has been sent to your phone number.',
          data: { vendorName: vendorData.vendorName, otp: true },
        } as ResponsePayload;
      } else {
        return {
          success: false,
          message: 'Vendor not exists. Please check your phone number',
          data: { otp: false },
        } as ResponsePayload;
      }
    } catch (error) {
      console.log(error);
      if (error.code && error.code.toString() === ErrorCodes.UNIQUE_FIELD) {
        throw new ConflictException('Phone Number is already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  /**
   * Logged-in Vendor Info
   * Get All Vendors (Not Recommended)
   * Get All Vendors V3 (Filter, Pagination, Select, Sort, Search Query with Aggregation) ** Recommended
   * Get All Vendors by Search
   */
  async getLoggedInVendorData(
    vendor: Vendor,
    selectQuery: VendorSelectFieldDto,
  ): Promise<ResponsePayload> {
    try {
      let { select } = selectQuery;
      if (!select) {
        select = '-password';
      }
      const data = await this.vendorModel.findById(vendor._id).select(select);
      return {
        data,
        success: true,
      } as ResponsePayload;
    } catch (err) {
      this.logger.error(`${vendor.vendorName} is failed to retrieve data`);
      // console.log(err);
      throw new InternalServerErrorException();
    }
  }

  async getAllVendors(
    filterVendorDto: FilterAndPaginationVendorDto,
    searchQuery?: string,
  ): Promise<ResponsePayload> {
    const { filter } = filterVendorDto;
    const { pagination } = filterVendorDto;
    const { sort } = filterVendorDto;
    const { select } = filterVendorDto;

    /*** GET FROM CACHE ***/
    if (!pagination && !filter) {
      const cacheData: any[] = await this.cacheManager.get(this.cacheAllData);
      const count: number = await this.cacheManager.get(this.cacheDataCount);
      if (cacheData) {
        this.logger.log('Cached page');
        return {
          data: cacheData,
          success: true,
          message: 'Success',
          count: count,
        } as ResponsePayload;
      }
    }
    this.logger.log('Not a Cached page');

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
      mFilter = {
        $and: [
          mFilter,
          {
            $or: [{ vendorName: { $regex: searchQuery, $options: 'i' } }],
          },
        ],
      };
    }
    // Sort
    if (sort) {
      mSort = sort;
    } else {
      mSort = { createdAt: -1 };
    }

    // Select
    if (select) {
      // Remove Sensitive Select
      delete select.password;
      mSelect = { ...mSelect, ...select };
    } else {
      mSelect = { password: 0 };
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
      // Remove Sensitive Select
      delete mSelect['password'];
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
              { $project: { password: 0 } },
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
      const dataAggregates = await this.vendorModel.aggregate(aggregateStages);
      if (pagination) {
        return {
          ...{ ...dataAggregates[0] },
          ...{ success: true, message: 'Success' },
        } as ResponsePayload;
      } else {
        /*** SET CACHE DATA**/
        if (!filter) {
          await this.cacheManager.set(this.cacheAllData, dataAggregates);
          await this.cacheManager.set(
            this.cacheDataCount,
            dataAggregates.length,
          );
          this.logger.log('Cache Added');
        }

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

  /**
   * Get Vendor by ID
   * Update Vendor by Id
   * Delete Vendor by Id
   */

  async getVendorById(
    id: string,
    vendorSelectFieldDto: VendorSelectFieldDto,
  ): Promise<ResponsePayload> {
    try {
      let { select } = vendorSelectFieldDto;
      if (!select) {
        select = '-password';
      }
      const data = await this.vendorModel.findById(id).select(select);
      return {
        success: true,
        message: 'Success',
        data,
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  async updateLoggedInVendorInfo(
    vendors: Vendor,
    updateVendorDto: UpdateVendorDto,
  ): Promise<ResponsePayload> {
    const { password, vendorName } = updateVendorDto;
    let vendor;
    try {
      vendor = await this.vendorModel.findById(vendors._id);
    } catch (err) {
      throw new InternalServerErrorException();
    }
    if (!vendor) {
      throw new NotFoundException('No Vendor found!');
    }
    try {
      // Check vendorName
      if (vendorName) {
        const isExists = await this.vendorModel.findOne({ vendorName });
        if (isExists) {
          return {
            success: false,
            message: 'vendorName already exists',
          } as ResponsePayload;
        }
      }

      // Cache Removed
      await this.cacheManager.del(this.cacheAllData);
      await this.cacheManager.del(this.cacheDataCount);

      // Check Password
      if (password) {
        const salt = await bcrypt.genSalt();
        const hashedPass = await bcrypt.hash(password, salt);
        await this.vendorModel.findByIdAndUpdate(vendors._id, {
          $set: { ...updateVendorDto, ...{ password: hashedPass } },
        });
        return {
          success: true,
          message: 'Data & Password changed success',
        } as ResponsePayload;
      }
      await this.vendorModel.findByIdAndUpdate(vendors._id, {
        $set: updateVendorDto,
      });
      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  // async changeLoggedInVendorPassword(
  //   vendors: Vendor,
  //   changePasswordDto: ChangePasswordDto,
  // ): Promise<ResponsePayload> {
  //   const { password, oldPassword } = changePasswordDto;
  //   let vendor;
  //   try {
  //     vendor = await this.vendorModel.findById(vendors._id).select('password');
  //   } catch (err) {
  //     throw new InternalServerErrorException();
  //   }
  //   if (!vendor) {
  //     throw new NotFoundException('No Vendor found!');
  //   }
  //   try {
  //     // Check Old Password
  //     const isMatch = await bcrypt.compare(oldPassword, vendor.password);

  //     // Change Password
  //     if (isMatch) {
  //       const salt = await bcrypt.genSalt();
  //       const hashedPass = await bcrypt.hash(password, salt);
  //       await this.vendorModel.findByIdAndUpdate(vendors._id, {
  //         $set: { password: hashedPass },
  //       });
  //       return {
  //         success: true,
  //         message: 'Password changed success',
  //       } as ResponsePayload;
  //     } else {
  //       return {
  //         success: false,
  //         message: 'Old password is incorrect!',
  //       } as ResponsePayload;
  //     }
  //   } catch (err) {
  //     console.log(err);
  //     throw new InternalServerErrorException();
  //   }
  // }

  async checkVendorAndSentOtp(
    checkVendorDto: CheckVendorDto,
  ): Promise<ResponsePayload> {
    try {
      const { phoneNo, email } = checkVendorDto;
      let vendor;
      if (phoneNo && !email) {
        vendor = await this.vendorModel.findOne({ phoneNo: phoneNo });
      }

      if (!phoneNo && email) {
        vendor = await this.vendorModel.findOne({ email: email });
      }

      if (vendor) {
        if (phoneNo) {
          return this.otpService.generateOtpWithPhoneNo({ phoneNo });
        }
      } else {
        return {
          success: false,
          message: 'Vendor no exists',
        } as ResponsePayload;
      }
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }

  async resetVendorPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<ResponsePayload> {
    const { password, phoneNo } = resetPasswordDto;
    let vendor;
    try {
      vendor = await this.vendorModel
        .findOne({ vendorName: phoneNo })
        .select('password');
    } catch (err) {
      throw new InternalServerErrorException();
    }
    if (!vendor) {
      throw new NotFoundException('No Vendor found!');
    }
    try {
      const salt = await bcrypt.genSalt();
      const hashedPass = await bcrypt.hash(password, salt);
      await this.vendorModel.findByIdAndUpdate(vendor._id, {
        $set: { password: hashedPass },
      });
      return {
        success: true,
        message: 'Password reset success',
      } as ResponsePayload;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }

  async updateVendorById(
    id: string,
    updateVendorDto: UpdateVendorDto,
  ): Promise<ResponsePayload> {
    const { vendorName } = updateVendorDto;
    let vendor;
    try {
      vendor = await this.vendorModel.findById(id);
    } catch (err) {
      throw new InternalServerErrorException();
    }
    if (!vendor) {
      throw new NotFoundException('No vendor found!');
    }
    try {
      // Check Vendorname
      if (vendorName) {
        if (vendor.vendorName !== vendorName) {
          const isExists = await this.vendorModel.findOne({ vendorName });
          if (isExists) {
            return {
              success: false,
              message: 'Vendorname already exists',
            } as ResponsePayload;
          }
        } else {
          await this.vendorModel.findByIdAndUpdate(id, {
            $set: { ...updateVendorDto },
          });
          return {
            success: true,
            message: 'Data & Password changed success',
          } as ResponsePayload;
        }
      }
      // Cache Removed
      await this.cacheManager.del(this.cacheAllData);
      await this.cacheManager.del(this.cacheDataCount);

      // Check Password
      // if (newPassword) {
      //   const salt = await bcrypt.genSalt();
      //   const hashedPass = await bcrypt.hash(newPassword, salt);
      //   await this.vendorModel.findByIdAndUpdate(id, {
      //     $set: { ...updateVendorDto, ...{ password: hashedPass } },
      //   });
      //   return {
      //     success: true,
      //     message: 'Data & Password changed success',
      //   } as ResponsePayload;
      // }
      // // Delete No Action Data
      // delete updateVendorDto.password;
      await this.vendorModel.findByIdAndUpdate(id, {
        $set: updateVendorDto,
      });
      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  async deleteVendorById(id: string): Promise<ResponsePayload> {
    let vendor;
    try {
      vendor = await this.vendorModel.findById(id);
    } catch (err) {
      throw new InternalServerErrorException();
    }
    if (!vendor) {
      throw new NotFoundException('No Vendor found!');
    }
    try {
      await this.vendorModel.findByIdAndDelete(id);
      // Cache Removed
      await this.cacheManager.del(this.cacheAllData);
      await this.cacheManager.del(this.cacheDataCount);

      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  async deleteMultipleVendorById(
    ids: string[],
    checkUsage: boolean,
  ): Promise<ResponsePayload> {
    try {
      const mIds = ids.map((m) => new ObjectId(m));
      await this.vendorModel.deleteMany({ _id: mIds });
      // Cache Removed
      await this.cacheManager.del(this.cacheAllData);
      await this.cacheManager.del(this.cacheDataCount);

      // Reset Product Category Reference
      // if (checkUsage) {
      //   const defaultData = await this.taskModel.findOne({
      //     readOnly: true,
      //   });
      //   const resetData = {
      //     task: {
      //       _id: defaultData._id,
      //       name: defaultData.name,
      //     },
      //   };
      //
      //   // Update Product
      //   await this.vendorModel.updateMany(
      //     { 'task._id': { $in: mIds } },
      //     { $set: resetData },
      //   );
      // }
      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

}
