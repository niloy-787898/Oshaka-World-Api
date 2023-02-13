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
  AddContactUsDto,
  FilterAndPaginationContactUsDto,
  OptionContactUsDto,
  UpdateContactUsDto,
} from '../../../dto/contact-us.dto';
import { ResponsePayload } from '../../../interfaces/core/response-payload.interface';
import { MongoIdValidationPipe } from '../../../pipes/mongo-id-validation.pipe';
import { ContactUsService } from './contact-us.service';

@Controller('contact-us')
export class ContactUsController {
  private logger = new Logger(ContactUsController.name);

  constructor(private contactUsService: ContactUsService) {}

  /**
   * addContactUs
   * insertManyContactUs
   */
  @Post('/add')
  @UsePipes(ValidationPipe)
  async addContactUs(
    @Body()
    addContactUsDto: AddContactUsDto,
  ): Promise<ResponsePayload> {
    return await this.contactUsService.addContactUs(addContactUsDto);
  }

  @Post('/insert-many')
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.CREATE)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminJwtAuthGuard)
  async insertManyContactUs(
    @Body()
    body: {
      data: AddContactUsDto[];
      option: OptionContactUsDto;
    },
  ): Promise<ResponsePayload> {
    return await this.contactUsService.insertManyContactUs(
      body.data,
      body.option,
    );
  }

  /**
   * getAllContactUss
   * getContactUsById
   */
  @Version(VERSION_NEUTRAL)
  @Post('/get-all')
  @UsePipes(ValidationPipe)
  async getAllContactUss(
    @Body() filterContactUsDto: FilterAndPaginationContactUsDto,
    @Query('q') searchString: string,
  ): Promise<ResponsePayload> {
    return this.contactUsService.getAllContactUss(
      filterContactUsDto,
      searchString,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Get('/get-all-basic')
  async getAllContactUssBasic(): Promise<ResponsePayload> {
    return await this.contactUsService.getAllContactUssBasic();
  }

  @Version(VERSION_NEUTRAL)
  @Get('/:id')
  // @AdminMetaRoles(AdminRoles.SUPER_ADMIN, AdminRoles.ADMIN)
  // @UseGuards(AdminRolesGuard)
  // @UseGuards(AdminJwtAuthGuard)
  async getContactUsById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query() select: string,
  ): Promise<ResponsePayload> {
    return await this.contactUsService.getContactUsById(id, select);
  }

  /**
   * updateContactUsById
   * updateMultipleContactUsById
   */
  @Version(VERSION_NEUTRAL)
  @Put('/update/:id')
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.EDIT)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminJwtAuthGuard)
  async updateContactUsById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Body() updateContactUsDto: UpdateContactUsDto,
  ): Promise<ResponsePayload> {
    return await this.contactUsService.updateContactUsById(
      id,
      updateContactUsDto,
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
  async updateMultipleContactUsById(
    @Body() updateContactUsDto: UpdateContactUsDto,
  ): Promise<ResponsePayload> {
    return await this.contactUsService.updateMultipleContactUsById(
      updateContactUsDto.ids,
      updateContactUsDto,
    );
  }

  /**
   * deleteContactUsById
   * deleteMultipleContactUsById
   */
  @Version(VERSION_NEUTRAL)
  @Delete('/delete/:id')
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.DELETE)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminJwtAuthGuard)
  async deleteContactUsById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query('checkUsage') checkUsage: boolean,
  ): Promise<ResponsePayload> {
    return await this.contactUsService.deleteContactUsById(id);
  }

  @Version(VERSION_NEUTRAL)
  @Post('/delete-multiple')
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.DELETE)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminJwtAuthGuard)
  async deleteMultipleContactUsById(
    @Body() data: { ids: string[] },
    @Query('checkUsage') checkUsage: boolean,
  ): Promise<ResponsePayload> {
    return await this.contactUsService.deleteMultipleContactUsById(data.ids);
  }
}
