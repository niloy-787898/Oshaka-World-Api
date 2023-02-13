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
  AddDealOnPlayDto,
  FilterAndPaginationDealOnPlayDto,
  OptionDealOnPlayDto,
  UpdateDealOnPlayDto,
} from '../../../dto/deal-on-play.dto';
import { ResponsePayload } from '../../../interfaces/core/response-payload.interface';
import { MongoIdValidationPipe } from '../../../pipes/mongo-id-validation.pipe';
import { DealOnPlayService } from './deal-on-play.service';

@Controller('deal-on-play')
export class DealOnPlayController {
  private logger = new Logger(DealOnPlayController.name);

  constructor(private dealOnPlayService: DealOnPlayService) {}

  /**
   * addDealOnPlay
   * insertManyDealOnPlay
   */
  @Post('/add')
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.CREATE)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminJwtAuthGuard)
  async addDealOnPlay(
    @Body()
    addDealOnPlayDto: AddDealOnPlayDto,
  ): Promise<ResponsePayload> {
    return await this.dealOnPlayService.addDealOnPlay(addDealOnPlayDto);
  }

  @Post('/insert-many')
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.CREATE)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminJwtAuthGuard)
  async insertManyDealOnPlay(
    @Body()
    body: {
      data: AddDealOnPlayDto[];
      option: OptionDealOnPlayDto;
    },
  ): Promise<ResponsePayload> {
    return await this.dealOnPlayService.insertManyDealOnPlay(
      body.data,
      body.option,
    );
  }

  /**
   * getAllDealOnPlays
   * getDealOnPlayById
   */
  @Version(VERSION_NEUTRAL)
  @Post('/get-all')
  @UsePipes(ValidationPipe)
  async getAllDealOnPlays(
    @Body() filterDealOnPlayDto: FilterAndPaginationDealOnPlayDto,
    @Query('q') searchString: string,
  ): Promise<ResponsePayload> {
    return this.dealOnPlayService.getAllDealOnPlays(
      filterDealOnPlayDto,
      searchString,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Get('/get-all-basic')
  async getAllDealOnPlaysBasic(): Promise<ResponsePayload> {
    return await this.dealOnPlayService.getAllDealOnPlaysBasic();
  }

  @Version(VERSION_NEUTRAL)
  @Get('/:id')
  // @AdminMetaRoles(AdminRoles.SUPER_ADMIN, AdminRoles.ADMIN)
  // @UseGuards(AdminRolesGuard)
  // @UseGuards(AdminJwtAuthGuard)
  async getDealOnPlayById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query() select: string,
  ): Promise<ResponsePayload> {
    return await this.dealOnPlayService.getDealOnPlayById(id, select);
  }

  /**
   * updateDealOnPlayById
   * updateMultipleDealOnPlayById
   */
  @Version(VERSION_NEUTRAL)
  @Put('/update/:id')
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.EDIT)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminJwtAuthGuard)
  async updateDealOnPlayById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Body() updateDealOnPlayDto: UpdateDealOnPlayDto,
  ): Promise<ResponsePayload> {
    return await this.dealOnPlayService.updateDealOnPlayById(
      id,
      updateDealOnPlayDto,
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
  async updateMultipleDealOnPlayById(
    @Body() updateDealOnPlayDto: UpdateDealOnPlayDto,
  ): Promise<ResponsePayload> {
    return await this.dealOnPlayService.updateMultipleDealOnPlayById(
      updateDealOnPlayDto.ids,
      updateDealOnPlayDto,
    );
  }

  /**
   * deleteDealOnPlayById
   * deleteMultipleDealOnPlayById
   */
  @Version(VERSION_NEUTRAL)
  @Delete('/delete/:id')
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.DELETE)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminJwtAuthGuard)
  async deleteDealOnPlayById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query('checkUsage') checkUsage: boolean,
  ): Promise<ResponsePayload> {
    return await this.dealOnPlayService.deleteDealOnPlayById(id);
  }

  @Version(VERSION_NEUTRAL)
  @Post('/delete-multiple')
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.DELETE)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminJwtAuthGuard)
  async deleteMultipleDealOnPlayById(
    @Body() data: { ids: string[] },
    @Query('checkUsage') checkUsage: boolean,
  ): Promise<ResponsePayload> {
    return await this.dealOnPlayService.deleteMultipleDealOnPlayById(data.ids);
  }
}
