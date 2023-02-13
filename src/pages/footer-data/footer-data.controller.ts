import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Version,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import { AdminMetaRoles } from '../../decorator/admin-roles.decorator';
import { AdminRoles } from '../../enum/admin-roles.enum';
import { AdminRolesGuard } from '../../guards/admin-roles.guard';
import { AdminMetaPermissions } from '../../decorator/admin-permissions.decorator';
import { AdminPermissions } from '../../enum/admin-permission.enum';
import { AdminPermissionGuard } from '../../guards/admin-permission.guard';
import { AdminJwtAuthGuard } from '../../guards/admin-jwt-auth.guard';

import { ResponsePayload } from '../../interfaces/core/response-payload.interface';
import { MongoIdValidationPipe } from '../../pipes/mongo-id-validation.pipe';
import { FooterDataService } from './footer-data.service';
import { UserJwtAuthGuard } from '../../guards/user-jwt-auth.guard';
import {
  AddFooterDataDto,
  FilterAndPaginationFooterDataDto,
  OptionFooterDataDto,
  UpdateFooterDataDto,
} from '../../dto/footer-data.dto';

@Controller('footer-data')
export class FooterDataController {
  private logger = new Logger(FooterDataController.name);

  constructor(private footerdataService: FooterDataService) {}

  /**
   * addFooterData
   * insertManyFooterData
   */
  @Post('/add-footer-data')
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.CREATE)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminJwtAuthGuard)
  async addFooterData(
    @Body()
    addFooterDataDto: AddFooterDataDto,
  ): Promise<ResponsePayload> {
    return await this.footerdataService.addFooterData(addFooterDataDto);
  }


  /**
   * getAllFooterDatas
   * getFooterDataById
   * getUserFooterDataById
   */
  @Version(VERSION_NEUTRAL)
  @Get('/get-all-footer-data')
  @UsePipes(ValidationPipe)
  async getAllFooterData(): Promise<ResponsePayload> {
    return this.footerdataService.getAllFooterData();
  }


  /**
   * updateFooterDataById
   * updateMultipleFooterDataById
   */
  @Version(VERSION_NEUTRAL)
  @Put('/update-footer-data/:id')
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.EDIT)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminJwtAuthGuard)
  async updateFooterDataById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Body() updateFooterDataDto: UpdateFooterDataDto,
  ): Promise<ResponsePayload> {
    return await this.footerdataService.updateFooterDataById(
      id,
      updateFooterDataDto,
    );
  }

}
