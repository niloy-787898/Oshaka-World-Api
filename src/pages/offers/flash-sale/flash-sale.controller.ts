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
import { AdminMetaRoles } from '../../../decorator/admin-roles.decorator';
import { AdminRoles } from '../../../enum/admin-roles.enum';
import { AdminRolesGuard } from '../../../guards/admin-roles.guard';
import { AdminMetaPermissions } from '../../../decorator/admin-permissions.decorator';
import { AdminPermissions } from '../../../enum/admin-permission.enum';
import { AdminPermissionGuard } from '../../../guards/admin-permission.guard';
import { AdminJwtAuthGuard } from '../../../guards/admin-jwt-auth.guard';
import {
  AddFlashSaleDto,
  FilterAndPaginationFlashSaleDto,
  OptionFlashSaleDto,
  UpdateFlashSaleDto,
} from '../../../dto/flash-sale.dto';
import { ResponsePayload } from '../../../interfaces/core/response-payload.interface';
import { MongoIdValidationPipe } from '../../../pipes/mongo-id-validation.pipe';
import { FlashSaleService } from './flash-sale.service';

@Controller('flash-sale')
export class FlashSaleController {
  private logger = new Logger(FlashSaleController.name);

  constructor(private flashSaleService: FlashSaleService) {}

  /**
   * addFlashSale
   * insertManyFlashSale
   */
  @Post('/add')
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.CREATE)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminJwtAuthGuard)
  async addFlashSale(
    @Body()
    addFlashSaleDto: AddFlashSaleDto,
  ): Promise<ResponsePayload> {
    return await this.flashSaleService.addFlashSale(addFlashSaleDto);
  }

  @Post('/insert-many')
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.CREATE)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminJwtAuthGuard)
  async insertManyFlashSale(
    @Body()
    body: {
      data: AddFlashSaleDto[];
      option: OptionFlashSaleDto;
    },
  ): Promise<ResponsePayload> {
    return await this.flashSaleService.insertManyFlashSale(
      body.data,
      body.option,
    );
  }

  /**
   * getAllFlashSales
   * getFlashSaleById
   */
  @Version(VERSION_NEUTRAL)
  @Post('/get-all')
  @UsePipes(ValidationPipe)
  async getAllFlashSales(
    @Body() filterFlashSaleDto: FilterAndPaginationFlashSaleDto,
    @Query('q') searchString: string,
  ): Promise<ResponsePayload> {
    return this.flashSaleService.getAllFlashSales(
      filterFlashSaleDto,
      searchString,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Get('/get-all-basic')
  async getAllFlashSalesBasic(): Promise<ResponsePayload> {
    return await this.flashSaleService.getAllFlashSalesBasic();
  }

  @Version(VERSION_NEUTRAL)
  @Get('/:id')
  // @AdminMetaRoles(AdminRoles.SUPER_ADMIN, AdminRoles.ADMIN)
  // @UseGuards(AdminRolesGuard)
  // @UseGuards(AdminJwtAuthGuard)
  async getFlashSaleById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query() select: string,
  ): Promise<ResponsePayload> {
    return await this.flashSaleService.getFlashSaleById(id, select);
  }

  /**
   * updateFlashSaleById
   * updateMultipleFlashSaleById
   */
  @Version(VERSION_NEUTRAL)
  @Put('/update/:id')
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.EDIT)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminJwtAuthGuard)
  async updateFlashSaleById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Body() updateFlashSaleDto: UpdateFlashSaleDto,
  ): Promise<ResponsePayload> {
    return await this.flashSaleService.updateFlashSaleById(
      id,
      updateFlashSaleDto,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Put('/update-multiple')
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.EDIT)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminJwtAuthGuard)
  async updateMultipleFlashSaleById(
    @Body() updateFlashSaleDto: UpdateFlashSaleDto,
  ): Promise<ResponsePayload> {
    return await this.flashSaleService.updateMultipleFlashSaleById(
      updateFlashSaleDto.ids,
      updateFlashSaleDto,
    );
  }

  /**
   * deleteFlashSaleById
   * deleteMultipleFlashSaleById
   */
  @Version(VERSION_NEUTRAL)
  @Delete('/delete/:id')
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.DELETE)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminJwtAuthGuard)
  async deleteFlashSaleById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query('checkUsage') checkUsage: boolean,
  ): Promise<ResponsePayload> {
    return await this.flashSaleService.deleteFlashSaleById(id);
  }

  @Version(VERSION_NEUTRAL)
  @Post('/delete-multiple')
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.DELETE)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminJwtAuthGuard)
  async deleteMultipleFlashSaleById(
    @Body() data: { ids: string[] },
    @Query('checkUsage') checkUsage: boolean,
  ): Promise<ResponsePayload> {
    return await this.flashSaleService.deleteMultipleFlashSaleById(data.ids);
  }
}
