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
import { AdminMetaRoles } from '../../decorator/admin-roles.decorator';
import { AdminRoles } from '../../enum/admin-roles.enum';
import { AdminRolesGuard } from '../../guards/admin-roles.guard';
import { AdminMetaPermissions } from '../../decorator/admin-permissions.decorator';
import { AdminPermissions } from '../../enum/admin-permission.enum';
import { AdminPermissionGuard } from '../../guards/admin-permission.guard';
import { AdminJwtAuthGuard } from '../../guards/admin-jwt-auth.guard';
import { ResponsePayload } from '../../interfaces/core/response-payload.interface';
import { MongoIdValidationPipe } from '../../pipes/mongo-id-validation.pipe';
import { BlogListService } from './blog-list.service';
import {
  AddBlogListDto,
  UpdateBlogListDto,
} from '../../dto/blog-list.dto';

@Controller('additional-page')
export class BlogListController {
  private logger = new Logger(BlogListController.name);

  constructor(private blogListService: BlogListService) {}

  /**
   * addBlogList
   * insertManyBlogList
   */
  @Post('/add')
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN, AdminRoles.ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.CREATE)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminJwtAuthGuard)
  async addBlogList(
    @Body()
    addBlogListDto: AddBlogListDto,
  ): Promise<ResponsePayload> {
    return await this.blogListService.addBlogList(
      addBlogListDto,
    );
  }

  /**
   * getAllBlogLists
   * getBlogListById
   */

  @Version(VERSION_NEUTRAL)
  @Get('/:slug')
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN, AdminRoles.ADMIN)
  @UseGuards(AdminRolesGuard)
  @UseGuards(AdminJwtAuthGuard)
  async getBlogListById(
    @Param('slug') slug: string,
    @Query() select: string,
  ): Promise<ResponsePayload> {
    return await this.blogListService.getBlogListBySlug(
      slug,
      select,
    );
  }

  /**
   * updateBlogListById
   * updateMultipleBlogListById
   */
  @Version(VERSION_NEUTRAL)
  @Put('/update-data/:slug')
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN, AdminRoles.ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.EDIT)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminJwtAuthGuard)
  async updateBlogListById(
    @Param('slug', MongoIdValidationPipe) slug: string,
    @Body() updateBlogListDto: UpdateBlogListDto,
  ): Promise<ResponsePayload> {
    return await this.blogListService.updateBlogListBySlug(
      slug,
      updateBlogListDto,
    );
  }

  /**
   * deleteBlogListById
   * deleteMultipleBlogListById
   */
  @Version(VERSION_NEUTRAL)
  @Delete('/delete-data/:slug')
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN, AdminRoles.ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.DELETE)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminJwtAuthGuard)
  async deleteBlogListById(
    @Param('slug', MongoIdValidationPipe) slug: string,
    @Query('checkUsage') checkUsage: boolean,
  ): Promise<ResponsePayload> {
    return await this.blogListService.deleteBlogListBySlug(
      slug,
      Boolean(checkUsage),
    );
  }
}
