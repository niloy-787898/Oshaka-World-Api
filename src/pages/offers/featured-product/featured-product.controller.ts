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
  AddFeaturedProductDto,
  FilterAndPaginationFeaturedProductDto,
  OptionFeaturedProductDto,
  UpdateFeaturedProductDto,
} from '../../../dto/featured-product.dto';
import { ResponsePayload } from '../../../interfaces/core/response-payload.interface';
import { MongoIdValidationPipe } from '../../../pipes/mongo-id-validation.pipe';
import { FeaturedProductService } from './featured-product.service';

@Controller('featured-product')
export class FeaturedProductController {
  private logger = new Logger(FeaturedProductController.name);

  constructor(private featuredProductService: FeaturedProductService) {}

  /**
   * addFeaturedProduct
   * insertManyFeaturedProduct
   */
  @Post('/add')
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.CREATE)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminJwtAuthGuard)
  async addFeaturedProduct(
    @Body()
    addFeaturedProductDto: AddFeaturedProductDto,
  ): Promise<ResponsePayload> {
    return await this.featuredProductService.addFeaturedProduct(
      addFeaturedProductDto,
    );
  }

  @Post('/insert-many')
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.CREATE)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminJwtAuthGuard)
  async insertManyFeaturedProduct(
    @Body()
    body: {
      data: AddFeaturedProductDto[];
      option: OptionFeaturedProductDto;
    },
  ): Promise<ResponsePayload> {
    return await this.featuredProductService.insertManyFeaturedProduct(
      body.data,
      body.option,
    );
  }

  /**
   * getAllFeaturedProducts
   * getFeaturedProductById
   */
  @Version(VERSION_NEUTRAL)
  @Post('/get-all')
  @UsePipes(ValidationPipe)
  async getAllFeaturedProducts(
    @Body() filterFeaturedProductDto: FilterAndPaginationFeaturedProductDto,
    @Query('q') searchString: string,
  ): Promise<ResponsePayload> {
    return this.featuredProductService.getAllFeaturedProducts(
      filterFeaturedProductDto,
      searchString,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Get('/get-all-basic')
  async getAllFeaturedProductsBasic(): Promise<ResponsePayload> {
    return await this.featuredProductService.getAllFeaturedProductsBasic();
  }

  @Version(VERSION_NEUTRAL)
  @Get('/:id')
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN, AdminRoles.ADMIN)
  @UseGuards(AdminRolesGuard)
  @UseGuards(AdminJwtAuthGuard)
  async getFeaturedProductById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query() select: string,
  ): Promise<ResponsePayload> {
    return await this.featuredProductService.getFeaturedProductById(id, select);
  }

  /**
   * updateFeaturedProductById
   * updateMultipleFeaturedProductById
   */
  @Version(VERSION_NEUTRAL)
  @Put('/update/:id')
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.EDIT)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminJwtAuthGuard)
  async updateFeaturedProductById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Body() updateFeaturedProductDto: UpdateFeaturedProductDto,
  ): Promise<ResponsePayload> {
    return await this.featuredProductService.updateFeaturedProductById(
      id,
      updateFeaturedProductDto,
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
  async updateMultipleFeaturedProductById(
    @Body() updateFeaturedProductDto: UpdateFeaturedProductDto,
  ): Promise<ResponsePayload> {
    return await this.featuredProductService.updateMultipleFeaturedProductById(
      updateFeaturedProductDto.ids,
      updateFeaturedProductDto,
    );
  }

  /**
   * deleteFeaturedProductById
   * deleteMultipleFeaturedProductById
   */
  @Version(VERSION_NEUTRAL)
  @Delete('/delete/:id')
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.DELETE)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminJwtAuthGuard)
  async deleteFeaturedProductById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query('checkUsage') checkUsage: boolean,
  ): Promise<ResponsePayload> {
    return await this.featuredProductService.deleteFeaturedProductById(
      id,
      Boolean(checkUsage),
    );
  }

  @Version(VERSION_NEUTRAL)
  @Post('/delete-multiple')
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.DELETE)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminJwtAuthGuard)
  async deleteMultipleFeaturedProductById(
    @Body() data: { ids: string[] },
    @Query('checkUsage') checkUsage: boolean,
  ): Promise<ResponsePayload> {
    return await this.featuredProductService.deleteMultipleFeaturedProductById(
      data.ids,
      Boolean(checkUsage),
    );
  }
}
