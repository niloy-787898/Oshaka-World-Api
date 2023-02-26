import {
  Body,
  Controller, Delete,
  Get,
  Logger,
  Param,
  Post,
  Put, Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Version,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import { AdminMetaRoles } from '../../../decorator/admin-roles.decorator';
import { AdminMetaPermissions } from '../../../decorator/admin-permissions.decorator';
import { AdminRolesGuard } from '../../../guards/admin-roles.guard';
import { AdminPermissionGuard } from '../../../guards/admin-permission.guard';
import { AdminRoles } from '../../../enum/admin-roles.enum';
import { ResponsePayload } from '../../../interfaces/core/response-payload.interface';
import { AdminJwtAuthGuard } from '../../../guards/admin-jwt-auth.guard';
import {
  AddVandorPaymentDto,
  UpdateVandorPaymentDto,
} from '../../../dto/vendor-payment.dto';
import { MongoIdValidationPipe } from '../../../pipes/mongo-id-validation.pipe';
import { AdminPermissions } from '../../../enum/admin-permission.enum';
import { VandorPaymentService } from './vandor-payment.service';

@Controller('shipping-charge')
export class VandorPaymentController {
  private logger = new Logger(VandorPaymentController.name);

  constructor(private vandorPaymentService: VandorPaymentService) {}

  /**
   * addVandorPayment
   * insertManyVandorPayment
   */
  @Post('/make-vendor-payment')
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.CREATE)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminJwtAuthGuard)
  async makeVendorPayment(
    @Body()
    addVandorPaymentDto: AddVandorPaymentDto,
  ): Promise<ResponsePayload> {
    return await this.vandorPaymentService.makeVendorPayment(
      addVandorPaymentDto,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Get('/get-vendor-payments/:id')
  async getVandorPayment(
    @Param('id', MongoIdValidationPipe) id: string,
  ): Promise<ResponsePayload> {
    return await this.vandorPaymentService.getVandorPayment(id);
  }

  @Version(VERSION_NEUTRAL)
  @Put('/update-payment-status/:id')
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.EDIT)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminJwtAuthGuard)
  async changePaymentStatusById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Body() updateVandorPaymentDto: UpdateVandorPaymentDto,
  ): Promise<ResponsePayload> {
    return await this.vandorPaymentService.changePaymentStatusById(
      id,
      updateVandorPaymentDto,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Delete('/edit-vendor-payment-by-id/:id')
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.DELETE)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminJwtAuthGuard)
  async deleteVendorPaymentById(
      @Param('id', MongoIdValidationPipe) id: string,
      @Query('checkUsage') checkUsage: boolean,
  ): Promise<ResponsePayload> {
    return await this.vandorPaymentService.deleteVendorPaymentById(id);
  }
}
