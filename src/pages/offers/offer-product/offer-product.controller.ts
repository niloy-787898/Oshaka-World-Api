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
  AddOfferProductDto,
  FilterAndPaginationOfferProductDto,
  OptionOfferProductDto,
  UpdateOfferProductDto,
} from '../../../dto/offer-product.dto';
import { ResponsePayload } from '../../../interfaces/core/response-payload.interface';
import { MongoIdValidationPipe } from '../../../pipes/mongo-id-validation.pipe';
import { OfferProductService } from './offer-product.service';

@Controller('offer-product')
export class OfferProductController {
  private logger = new Logger(OfferProductController.name);

  constructor(private offerProductService: OfferProductService) {}

  /**
   * addOfferProduct
   * insertManyOfferProduct
   */
  @Post('/add')
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.CREATE)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminJwtAuthGuard)
  async addOfferProduct(
    @Body()
    addOfferProductDto: AddOfferProductDto,
  ): Promise<ResponsePayload> {
    return await this.offerProductService.addOfferProduct(addOfferProductDto);
  }

  @Post('/insert-many')
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.CREATE)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminJwtAuthGuard)
  async insertManyOfferProduct(
    @Body()
    body: {
      data: AddOfferProductDto[];
      option: OptionOfferProductDto;
    },
  ): Promise<ResponsePayload> {
    return await this.offerProductService.insertManyOfferProduct(
      body.data,
      body.option,
    );
  }

  /**
   * getAllOfferProducts
   * getOfferProductById
   */
  @Version(VERSION_NEUTRAL)
  @Post('/get-all')
  @UsePipes(ValidationPipe)
  async getAllOfferProducts(
    @Body() filterOfferProductDto: FilterAndPaginationOfferProductDto,
    @Query('q') searchString: string,
  ): Promise<ResponsePayload> {
    return this.offerProductService.getAllOfferProducts(
      filterOfferProductDto,
      searchString,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Get('/get-all-basic')
  async getAllOfferProductsBasic(): Promise<ResponsePayload> {
    return await this.offerProductService.getAllOfferProductsBasic();
  }

  @Version(VERSION_NEUTRAL)
  @Get('/:id')
  // @AdminMetaRoles(AdminRoles.SUPER_ADMIN, AdminRoles.ADMIN)
  // @UseGuards(AdminRolesGuard)
  // @UseGuards(AdminJwtAuthGuard)
  async getOfferProductById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query() select: string,
  ): Promise<ResponsePayload> {
    return await this.offerProductService.getOfferProductById(id, select);
  }

  /**
   * updateOfferProductById
   * updateMultipleOfferProductById
   */
  @Version(VERSION_NEUTRAL)
  @Put('/update/:id')
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.EDIT)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminJwtAuthGuard)
  async updateOfferProductById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Body() updateOfferProductDto: UpdateOfferProductDto,
  ): Promise<ResponsePayload> {
    return await this.offerProductService.updateOfferProductById(
      id,
      updateOfferProductDto,
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
  async updateMultipleOfferProductById(
    @Body() updateOfferProductDto: UpdateOfferProductDto,
  ): Promise<ResponsePayload> {
    return await this.offerProductService.updateMultipleOfferProductById(
      updateOfferProductDto.ids,
      updateOfferProductDto,
    );
  }

  /**
   * deleteOfferProductById
   * deleteMultipleOfferProductById
   */
  @Version(VERSION_NEUTRAL)
  @Delete('/delete/:id')
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.DELETE)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminJwtAuthGuard)
  async deleteOfferProductById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query('checkUsage') checkUsage: boolean,
  ): Promise<ResponsePayload> {
    return await this.offerProductService.deleteOfferProductById(id);
  }

  @Version(VERSION_NEUTRAL)
  @Post('/delete-multiple')
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.DELETE)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminJwtAuthGuard)
  async deleteMultipleOfferProductById(
    @Body() data: { ids: string[] },
    @Query('checkUsage') checkUsage: boolean,
  ): Promise<ResponsePayload> {
    return await this.offerProductService.deleteMultipleOfferProductById(
      data.ids,
    );
  }
}
