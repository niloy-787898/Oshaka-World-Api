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
import { VendorService } from './vendor.service';
import { AuthGuard } from '@nestjs/passport';
import { ResponsePayload } from '../../interfaces/core/response-payload.interface';
import {
  AddAddressDto,
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
import { MongoIdValidationPipe } from '../../pipes/mongo-id-validation.pipe';
import { AdminJwtAuthGuard } from '../../guards/admin-jwt-auth.guard';
import { AdminMetaRoles } from '../../decorator/admin-roles.decorator';
import { AdminRoles } from '../../enum/admin-roles.enum';
import { AdminRolesGuard } from '../../guards/admin-roles.guard';
import { AdminMetaPermissions } from '../../decorator/admin-permissions.decorator';
import { AdminPermissions } from '../../enum/admin-permission.enum';
import { AdminPermissionGuard } from '../../guards/admin-permission.guard';
import { PASSPORT_USER_TOKEN_TYPE } from '../../core/global-variables';
import {
  Vendor,
  VendorAuthResponse,
} from '../../interfaces/user/vendor.interface';
import { GetVendor } from '../../decorator/get-user.decorator';
import { VendorJwtAuthGuard } from '../../guards/vendor-jwt-auth.guard';

@Controller('vendor')
export class VendorController {
  private logger = new Logger(VendorController.name);

  constructor(private vendorService: VendorService) {}

  /**
   * Vendor Signup
   * Vendor Login
   * Vendor Signup & Login
   */

  @Post('/signup')
  @UsePipes(ValidationPipe)
  async vendorSignup(
    @Body()
    createVendorDto: CreateVendorDto,
  ): Promise<VendorAuthResponse> {
    return await this.vendorService.vendorSignup(createVendorDto);
  }

  @Post('/login')
  @UsePipes(ValidationPipe)
  async vendorLogin(
    @Body() authVendorDto: AuthVendorDto,
  ): Promise<VendorAuthResponse> {
    return await this.vendorService.vendorLogin(authVendorDto);
  }

  @Post('/signup-and-login')
  @UsePipes(ValidationPipe)
  async vendorSignupAndLogin(
    @Body() createVendorDto: CreateVendorDto,
  ): Promise<VendorAuthResponse> {
    return await this.vendorService.vendorSignupAndLogin(createVendorDto);
  }

  @Post('/social-signup-and-login')
  @UsePipes(ValidationPipe)
  async vendorSignupAndLoginSocial(
    @Body() createVendorDto: CreateSocialVendorDto,
  ): Promise<VendorAuthResponse> {
    return await this.vendorService.vendorSignupAndLoginSocial(createVendorDto);
  }

  @Post('/check-vendor-for-registration')
  @UsePipes(ValidationPipe)
  async checkVendorForRegistration(
    @Body()
    checkVendorRegistrationDto: CheckVendorRegistrationDto,
  ): Promise<ResponsePayload> {
    return await this.vendorService.checkVendorForRegistration(
      checkVendorRegistrationDto,
    );
  }

  /**
   * Logged-in Vendor Info
   */
  @Version(VERSION_NEUTRAL)
  @Get('/logged-in-vendor-data')
  @UseGuards(AuthGuard(PASSPORT_USER_TOKEN_TYPE))
  async getLoggedInVendorData(
    @Query(ValidationPipe) vendorSelectFieldDto: VendorSelectFieldDto,
    @GetVendor() vendor: Vendor,
  ): Promise<ResponsePayload> {
    return this.vendorService.getLoggedInVendorData(
      vendor,
      vendorSelectFieldDto,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Get('/get-vendor-address')
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard(PASSPORT_USER_TOKEN_TYPE))
  async getAllAddress(@GetVendor() vendor: Vendor): Promise<ResponsePayload> {
    return await this.vendorService.getAllAddress(vendor);
  }
  /**
   * Get All Vendors (Not Recommended)
   * Get All Vendors V1 (Filter, Pagination, Select)
   * Get All Vendors V2 (Filter, Pagination, Select, Sort, Search Query)
   * Get All Vendors V3 (Filter, Pagination, Select, Sort, Search Query with Aggregation) ** Recommended
   * Get All Vendors by Search
   */

  @Version(VERSION_NEUTRAL)
  @Post('/get-all')
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(
    AdminRoles.SUPER_ADMIN,
    AdminRoles.ADMIN,
    AdminRoles.EDITOR,
    AdminRoles.ACCOUNTANT,
  )
  @UseGuards(AdminRolesGuard)
  @UseGuards(AdminJwtAuthGuard)
  async getAllVendorsV3(
    @Body() filterVendorDto: FilterAndPaginationVendorDto,
    @Query('q') searchString: string,
  ): Promise<ResponsePayload> {
    return this.vendorService.getAllVendors(filterVendorDto, searchString);
  }

  /**
   * Get Vendor by ID
   * Update Vendor by Id
   * Delete Vendor by Id#
   * resetVendorPassword()
   */
  @Version(VERSION_NEUTRAL)
  @Get('/:id')
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN, AdminRoles.ADMIN, AdminRoles.EDITOR)
  @UseGuards(AdminRolesGuard)
  @UseGuards(AdminJwtAuthGuard)
  async getVendorById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query(ValidationPipe) vendorSelectFieldDto: VendorSelectFieldDto,
  ): Promise<ResponsePayload> {
    return await this.vendorService.getVendorById(id, vendorSelectFieldDto);
  }

  @Version(VERSION_NEUTRAL)
  @Put('/update-logged-in-vendor')
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard(PASSPORT_USER_TOKEN_TYPE))
  async updateLoggedInVendorInfo(
    @GetVendor() vendor: Vendor,
    @Body() updateVendorDto: UpdateVendorDto,
  ): Promise<ResponsePayload> {
    return await this.vendorService.updateLoggedInVendorInfo(
      vendor,
      updateVendorDto,
    );
  }

  // @Version(VERSION_NEUTRAL)
  // @Put('/change-logged-in-vendor-password')
  // @UsePipes(ValidationPipe)
  // @UseGuards(AuthGuard(PASSPORT_USER_TOKEN_TYPE))
  // async changeLoggedInVendorPassword(
  //   @GetVendor() vendor: Vendor,
  //   @Body() changePasswordDto: ChangePasswordDto,
  // ): Promise<ResponsePayload> {
  //   return await this.vendorService.changeLoggedInVendorPassword(
  //     vendor,
  //     changePasswordDto,
  //   );
  // }

  @Version(VERSION_NEUTRAL)
  @Put('/reset-vendor-password')
  @UsePipes(ValidationPipe)
  async resetVendorPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<ResponsePayload> {
    return await this.vendorService.resetVendorPassword(resetPasswordDto);
  }

  @Version(VERSION_NEUTRAL)
  @Post('/check-vendor-and-sent-otp')
  @UsePipes(ValidationPipe)
  async checkVendorAndSentOtp(
    @Body() checkVendorDto: CheckVendorDto,
  ): Promise<ResponsePayload> {
    return await this.vendorService.checkVendorAndSentOtp(checkVendorDto);
  }

  @Version(VERSION_NEUTRAL)
  @Put('/update-data/:id')
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN, AdminRoles.ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.EDIT)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminJwtAuthGuard)
  @UsePipes(ValidationPipe)
  async updateVendorById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Body() updateVendorDto: UpdateVendorDto,
  ): Promise<ResponsePayload> {
    return await this.vendorService.updateVendorById(id, updateVendorDto);
  }

  @Version(VERSION_NEUTRAL)
  @Delete('/delete-data/:id')
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN, AdminRoles.ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.DELETE)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminJwtAuthGuard)
  async deleteVendorById(
    @Param('id', MongoIdValidationPipe) id: string,
  ): Promise<ResponsePayload> {
    return await this.vendorService.deleteVendorById(id);
  }

  @Version(VERSION_NEUTRAL)
  @Post('/delete-multiple-data-by-id')
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN, AdminRoles.ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.DELETE)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminJwtAuthGuard)
  async deleteMultipleTaskById(
    @Body() data: { ids: string[] },
    @Query('checkUsage') checkUsage: boolean,
  ): Promise<ResponsePayload> {
    return await this.vendorService.deleteMultipleVendorById(
      data.ids,
      Boolean(checkUsage),
    );
  }

  /**
   * Address
   * addNewAddress()
   * updateAddressById()
   * deleteAddressById()
   */

  @Version(VERSION_NEUTRAL)
  @Post('/add-address')
  @UsePipes(ValidationPipe)
  @UseGuards(VendorJwtAuthGuard)
  async addNewAddress(
    @GetVendor() vendor: Vendor,
    @Body() addAddressDto: AddAddressDto,
  ): Promise<ResponsePayload> {
    return await this.vendorService.addNewAddress(vendor, addAddressDto);
  }

  @Version(VERSION_NEUTRAL)
  @Put('/edit-address/:id')
  @UsePipes(ValidationPipe)
  @UseGuards(VendorJwtAuthGuard)
  async updateAddressById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ): Promise<ResponsePayload> {
    return await this.vendorService.updateAddressById(id, updateAddressDto);
  }

  @Version(VERSION_NEUTRAL)
  @Delete('/delete-address/:id')
  @UsePipes(ValidationPipe)
  @UseGuards(VendorJwtAuthGuard)
  async deleteAddressById(
    @Param('id', MongoIdValidationPipe) id: string,
    @GetVendor() vendor: Vendor,
  ): Promise<ResponsePayload> {
    return await this.vendorService.deleteAddressById(id, vendor);
  }
}
