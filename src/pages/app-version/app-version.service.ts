import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ResponsePayload } from '../../interfaces/core/response-payload.interface';
import { ErrorCodes } from '../../enum/error-code.enum';
import { AppVersion } from '../../interfaces/common/app-version.interface';
import { AddAppVersionDto } from '../../dto/app-version.dto';

@Injectable()
export class AppVersionService {
  private logger = new Logger(AppVersionService.name);

  constructor(
    @InjectModel('AppVersion')
    private readonly appVersionModel: Model<AppVersion>,
  ) {}

  /**
   * addAppVersion
   * insertManyAppVersion
   */
  async addAppVersion(
    addAppVersionDto: AddAppVersionDto,
  ): Promise<ResponsePayload> {
    try {
      const dataExists = await this.appVersionModel.findOne();

      if (dataExists) {
        await this.appVersionModel.updateOne(
          {},
          {
            $set: addAppVersionDto,
          },
        );
        return {
          success: true,
          message: 'Data Added Success',
        } as ResponsePayload;
      } else {
        const appVersion = new this.appVersionModel(addAppVersionDto);
        const response = await appVersion.save();
        return {
          success: true,
          message: 'Data Added Success',
          data: {
            _id: response._id,
          },
        } as ResponsePayload;
      }
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
   * getAppVersion()
   */

  async getAppVersion(): Promise<ResponsePayload> {
    try {
      const data = await this.appVersionModel.findOne();
      return {
        success: true,
        message: 'Success',
        data,
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
