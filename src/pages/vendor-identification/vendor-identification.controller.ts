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
import { VendorIdentificationService } from './vendor-identification.service';
import {
  AddVendorIdentificationDto,
  FilterAndPaginationVendorIdentificationDto,
  OptionVendorIdentificationDto,
  UpdateVendorIdentificationDto,
} from '../../dto/vendor-identification.dto';

import { PASSPORT_VENDOR_TOKEN_TYPE } from 'src/core/global-variables';
import { AuthGuard } from '@nestjs/passport';
import { VendorJwtAuthGuard } from 'src/guards/vendor-jwt-auth.guard';
import { GetVendor } from 'src/decorator/get-user.decorator';
import { Vendor } from 'src/interfaces/user/vendor.interface';

@Controller('vendor-identification')
export class VendorIdentificationController {
  private logger = new Logger(VendorIdentificationController.name);

  constructor(
    private vendorIdentificationService: VendorIdentificationService,
  ) {}

  /**
   * addVendorIdentification
   * insertManyVendorIdentification
   */
  @Post('/add-vendor-identification-data')
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard(PASSPORT_VENDOR_TOKEN_TYPE))
  @UseGuards(VendorJwtAuthGuard)
  async addVendorIdentification(
    @GetVendor() vendor: Vendor,
    @Body()
    addVendorIdentificationDto: AddVendorIdentificationDto,
  ): Promise<ResponsePayload> {
    return await this.vendorIdentificationService.addVendorIdentification(
      vendor._id,
      addVendorIdentificationDto,
    );
  }

  @Post('/insert-many')
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.CREATE)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminJwtAuthGuard)
  async insertManyVendorIdentification(
    @Body()
    body: {
      data: AddVendorIdentificationDto[];
      option: OptionVendorIdentificationDto;
    },
  ): Promise<ResponsePayload> {
    return await this.vendorIdentificationService.insertManyVendorIdentification(
      body.data,
      body.option,
    );
  }

  /**
   * getAllVendorIdentifications
   * getVendorIdentificationById
   * getUserVendorIdentificationById
   */
  @Version(VERSION_NEUTRAL)
  @Post('/get-all')
  @UsePipes(ValidationPipe)
  async getAllVendorIdentifications(
    @Body()
    filterVendorIdentificationDto: FilterAndPaginationVendorIdentificationDto,
    @Query('q') searchString: string,
  ): Promise<ResponsePayload> {
    return this.vendorIdentificationService.getAllVendorIdentifications(
      filterVendorIdentificationDto,
      searchString,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Get('/get-vendor-identification-data')
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard(PASSPORT_VENDOR_TOKEN_TYPE))
  @UseGuards(VendorJwtAuthGuard)
  async getUserVendorIdentificationById(
    @Query() select: string,
    @GetVendor() vendor: Vendor,
  ): Promise<ResponsePayload> {
    return await this.vendorIdentificationService.getUserVendorIdentificationById(
      vendor._id,
      select,
    );
  }

  /**
   * updateVendorIdentificationById
   * updateMultipleVendorIdentificationById
   */
  @Version(VERSION_NEUTRAL)
  @Put('/update-vendor-identification-data/:id')
  @UseGuards(AuthGuard(PASSPORT_VENDOR_TOKEN_TYPE))
  async updateVendorIdentificationById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Body() updateVendorIdentificationDto: UpdateVendorIdentificationDto,
  ): Promise<ResponsePayload> {
    return await this.vendorIdentificationService.updateVendorIdentificationById(
      id,
      updateVendorIdentificationDto,
    );
  }
}
