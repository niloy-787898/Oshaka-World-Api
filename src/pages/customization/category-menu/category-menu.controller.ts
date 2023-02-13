import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
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
import { MongoIdValidationPipe } from '../../../pipes/mongo-id-validation.pipe';
import { CategoryMenuService } from './category-menu.service';
import {
  AddCategoryMenuDto,
  UpdateCategoryMenuDto,
} from '../../../dto/category-menu.dto';

@Controller('category-menu')
export class CategoryMenuController {
  private logger = new Logger(CategoryMenuController.name);

  constructor(private categoryMenuService: CategoryMenuService) {}

  /**
   * addCategoryMenu
   * insertManyCategoryMenu
   */
  @Post('/add')
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.CREATE)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminJwtAuthGuard)
  async addCategoryMenu(
    @Body()
    addCategoryMenuDto: AddCategoryMenuDto,
  ): Promise<ResponsePayload> {
    return await this.categoryMenuService.addCategoryMenu(addCategoryMenuDto);
  }

  /**
   * getAllCategoryMenus
   * getCategoryMenuById
   */
  @Version(VERSION_NEUTRAL)
  @Get('/get-all')
  async getAllCategoryMenus(): Promise<ResponsePayload> {
    return this.categoryMenuService.getAllCategoryMenus();
  }

  @Version(VERSION_NEUTRAL)
  @Get('/:id')
  async getCategoryMenuById(
    @Param('id', MongoIdValidationPipe) id: string,
  ): Promise<ResponsePayload> {
    return await this.categoryMenuService.getCategoryMenuById(id);
  }

  /**
   * updateCategoryMenuById
   * updateMultipleCategoryMenuById
   */
  @Version(VERSION_NEUTRAL)
  @Put('/update/:id')
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.EDIT)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminJwtAuthGuard)
  async updateCategoryMenuById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Body() updateCategoryMenuDto: UpdateCategoryMenuDto,
  ): Promise<ResponsePayload> {
    return await this.categoryMenuService.updateCategoryMenuById(
      id,
      updateCategoryMenuDto,
    );
  }

  /**
   * deleteCategoryMenuById
   * deleteMultipleCategoryMenuById
   */
  @Version(VERSION_NEUTRAL)
  @Delete('/delete/:id')
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.DELETE)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminJwtAuthGuard)
  async deleteCategoryMenuById(
    @Param('id', MongoIdValidationPipe) id: string,
  ): Promise<ResponsePayload> {
    return await this.categoryMenuService.deleteCategoryMenuById(id);
  }
}
