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
  AddDealsOfTheDayDto,
  FilterAndPaginationDealsOfTheDayDto,
  OptionDealsOfTheDayDto,
  UpdateDealsOfTheDayDto,
} from '../../../dto/deals-of-the-day.dto';

import { ResponsePayload } from '../../../interfaces/core/response-payload.interface';
import { MongoIdValidationPipe } from '../../../pipes/mongo-id-validation.pipe';
import { DealsOfTheDayService } from './deals-of-the-day.service';

@Controller('deals-of-the-day')
export class DealsOfTheDayController {
  private logger = new Logger(DealsOfTheDayController.name);

  constructor(private dealOnPlayService: DealsOfTheDayService) {}

  /**
   * addDealsOfTheDay
   * insertManyDealsOfTheDay
   */
  @Post('/add')
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.CREATE)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminJwtAuthGuard)
  async addDealsOfTheDay(
    @Body()
    addDealsOfTheDayDto: AddDealsOfTheDayDto,
  ): Promise<ResponsePayload> {
    return await this.dealOnPlayService.addDealsOfTheDay(addDealsOfTheDayDto);
  }

  @Post('/insert-many')
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.CREATE)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminJwtAuthGuard)
  async insertManyDealsOfTheDay(
    @Body()
    body: {
      data: AddDealsOfTheDayDto[];
      option: OptionDealsOfTheDayDto;
    },
  ): Promise<ResponsePayload> {
    return await this.dealOnPlayService.insertManyDealsOfTheDay(
      body.data,
      body.option,
    );
  }

  /**
   * getAllDealsOfTheDays
   * getDealsOfTheDayById
   */
  @Version(VERSION_NEUTRAL)
  @Post('/get-all')
  @UsePipes(ValidationPipe)
  async getAllDealsOfTheDays(
    @Body() filterDealsOfTheDayDto: FilterAndPaginationDealsOfTheDayDto,
    @Query('q') searchString: string,
  ): Promise<ResponsePayload> {
    return this.dealOnPlayService.getAllDealsOfTheDays(
      filterDealsOfTheDayDto,
      searchString,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Get('/get-all-basic')
  async getAllDealsOfTheDaysBasic(): Promise<ResponsePayload> {
    return await this.dealOnPlayService.getAllDealsOfTheDaysBasic();
  }

  @Version(VERSION_NEUTRAL)
  @Get('/:id')
  // @AdminMetaRoles(AdminRoles.SUPER_ADMIN, AdminRoles.ADMIN)
  // @UseGuards(AdminRolesGuard)
  // @UseGuards(AdminJwtAuthGuard)
  async getDealsOfTheDayById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query() select: string,
  ): Promise<ResponsePayload> {
    return await this.dealOnPlayService.getDealsOfTheDayById(id, select);
  }

  /**
   * updateDealsOfTheDayById
   * updateMultipleDealsOfTheDayById
   */
  @Version(VERSION_NEUTRAL)
  @Put('/update/:id')
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.EDIT)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminJwtAuthGuard)
  async updateDealsOfTheDayById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Body() updateDealsOfTheDayDto: UpdateDealsOfTheDayDto,
  ): Promise<ResponsePayload> {
    return await this.dealOnPlayService.updateDealsOfTheDayById(
      id,
      updateDealsOfTheDayDto,
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
  async updateMultipleDealsOfTheDayById(
    @Body() updateDealsOfTheDayDto: UpdateDealsOfTheDayDto,
  ): Promise<ResponsePayload> {
    return await this.dealOnPlayService.updateMultipleDealsOfTheDayById(
      updateDealsOfTheDayDto.ids,
      updateDealsOfTheDayDto,
    );
  }

  /**
   * deleteDealsOfTheDayById
   * deleteMultipleDealsOfTheDayById
   */
  @Version(VERSION_NEUTRAL)
  @Delete('/delete/:id')
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.DELETE)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminJwtAuthGuard)
  async deleteDealsOfTheDayById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query('checkUsage') checkUsage: boolean,
  ): Promise<ResponsePayload> {
    return await this.dealOnPlayService.deleteDealsOfTheDayById(id);
  }

  @Version(VERSION_NEUTRAL)
  @Post('/delete-multiple')
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.DELETE)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminJwtAuthGuard)
  async deleteMultipleDealsOfTheDayById(
    @Body() data: { ids: string[] },
    @Query('checkUsage') checkUsage: boolean,
  ): Promise<ResponsePayload> {
    return await this.dealOnPlayService.deleteMultipleDealsOfTheDayById(
      data.ids,
    );
  }
}
