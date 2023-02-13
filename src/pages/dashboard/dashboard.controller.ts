import {
  Controller,
  Get,
  Logger,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Version,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { AdminRolesGuard } from '../../guards/admin-roles.guard';
import { AdminRoles } from '../../enum/admin-roles.enum';
import { AdminMetaRoles } from '../../decorator/admin-roles.decorator';
import { AdminJwtAuthGuard } from '../../guards/admin-jwt-auth.guard';
import { GetTokenUser } from '../../decorator/get-token-user.decorator';
import { ResponsePayload } from '../../interfaces/core/response-payload.interface';

@Controller('dashboard')
export class DashboardController {
  private logger = new Logger(DashboardController.name);

  constructor(private dashboardService: DashboardService) {}

  @Version(VERSION_NEUTRAL)
  @Get('/admin-dashboard')
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN, AdminRoles.ADMIN)
  @UseGuards(AdminRolesGuard)
  @UseGuards(AdminJwtAuthGuard)
  async getAdminDashboard(): Promise<ResponsePayload> {
    return await this.dashboardService.getAdminDashboard();
  }

  // @Version(VERSION_NEUTRAL)
  // @Get('/admin-catalog')
  // @AdminMetaRoles(AdminRoles.SUPER_ADMIN, AdminRoles.ADMIN)
  // @UseGuards(AdminRolesGuard)
  // @UseGuards(AdminJwtAuthGuard)
  // async getCatalogDashboard(): Promise<ResponsePayload> {
  //   return await this.dashboardService.getCatalogDashboard();
  // }

  // @Version(VERSION_NEUTRAL)
  // @Post('/resources')
  // @AdminMetaRoles(AdminRoles.SUPER_ADMIN, AdminRoles.ADMIN)
  // @UseGuards(AdminRolesGuard)
  // @UseGuards(AdminJwtAuthGuard)
  // async getResources(
  //   @Body() filterUserDto: FilterAndPaginationUserDto,
  //   @Query('isFree') isFree: string,
  //   @Query('q') searchString: string,
  // ): Promise<ResponsePayload> {
  //   return await this.dashboardService.getResources(
  //     isFree,
  //     filterUserDto,
  //     searchString,
  //   );
  // }
  //
  // /**
  //  * USER ACCESS API
  //  */
  // @Version(VERSION_NEUTRAL)
  // @Get('/user-dashboard')
  // @UseGuards(UserJwtAuthGuard)
  // @UsePipes(ValidationPipe)
  // async getUserDashboard(@GetTokenUser() user: User): Promise<ResponsePayload> {
  //   return await this.dashboardService.getUserDashboard(user);
  // }

  // @Version(VERSION_NEUTRAL)
  // @Post('/project-by-logged-in-user')
  // @UseGuards(UserJwtAuthGuard)
  // @UsePipes(ValidationPipe)
  // async getUserProjects(
  //   @GetTokenUser() user: User,
  //   @Body() filterProjectDto: FilterAndPaginationProjectDto,
  //   @Query('q') searchString: string,
  // ): Promise<ResponsePayload> {
  //   return await this.dashboardService.getUserProjects(
  //     user,
  //     filterProjectDto,
  //     searchString,
  //   );
  // }
}
