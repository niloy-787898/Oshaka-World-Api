import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Version,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import { AdminMetaRoles } from '../../../decorator/admin-roles.decorator';
import { AdminRoles } from '../../../enum/admin-roles.enum';
import { AdminRolesGuard } from '../../../guards/admin-roles.guard';
import { AdminMetaPermissions } from '../../../decorator/admin-permissions.decorator';
import { AdminPermissions } from '../../../enum/admin-permission.enum';
import { AdminPermissionGuard } from '../../../guards/admin-permission.guard';
import { AdminJwtAuthGuard } from '../../../guards/admin-jwt-auth.guard';

import { ResponsePayload } from '../../../interfaces/core/response-payload.interface';
import { VandorPaymentService } from './vandor-payment.service';
import { AddVandorPaymentDto } from '../../../dto/vendor-payment.dto';

@Controller('shipping-charge')
export class VandorPaymentController {
  private logger = new Logger(VandorPaymentController.name);

  constructor(private vandorPaymentService: VandorPaymentService) {}

  /**
   * addVandorPayment
   * insertManyVandorPayment
   */
  @Post('/add')
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.CREATE)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminJwtAuthGuard)
  async addVandorPayment(
    @Body()
    addVandorPaymentDto: AddVandorPaymentDto,
  ): Promise<ResponsePayload> {
    return await this.vandorPaymentService.addVandorPayment(
      addVandorPaymentDto,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Get('/get')
  async getVandorPayment(@Query() select: string): Promise<ResponsePayload> {
    return await this.vandorPaymentService.getVandorPayment(select);
  }
}
