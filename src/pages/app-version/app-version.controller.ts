import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  UsePipes,
  ValidationPipe,
  Version,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import { ResponsePayload } from '../../interfaces/core/response-payload.interface';
import { AppVersionService } from './app-version.service';
import { AddAppVersionDto } from '../../dto/app-version.dto';

@Controller('app-version')
export class AppVersionController {
  private logger = new Logger(AppVersionController.name);

  constructor(private appVersionService: AppVersionService) {}

  /**
   * addAppVersion
   * insertManyAppVersion
   */
  @Post('/add')
  @UsePipes(ValidationPipe)
  async addAppVersion(
    @Body()
    addAppVersionDto: AddAppVersionDto,
  ): Promise<ResponsePayload> {
    return await this.appVersionService.addAppVersion(addAppVersionDto);
  }

  /**
   * getAppVersion()
   */

  @Version(VERSION_NEUTRAL)
  @Get('/get')
  async getAppVersion(): Promise<ResponsePayload> {
    return await this.appVersionService.getAppVersion();
  }
}
