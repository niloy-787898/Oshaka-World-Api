import { Vendor } from './../../../interfaces/user/vendor.interface';
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
  AddOrderDto,
  FilterAndPaginationOrderDto,
  OptionOrderDto,
  UpdateOrderDto,
  UpdateOrderNoDto,
  UpdateOrderStatusDto,
} from '../../../dto/order.dto';
import { ResponsePayload } from '../../../interfaces/core/response-payload.interface';
import { MongoIdValidationPipe } from '../../../pipes/mongo-id-validation.pipe';
import { OrderService } from './order.service';
import { UserJwtAuthGuard } from '../../../guards/user-jwt-auth.guard';
import { VendorJwtAuthGuard } from '../../../guards/vendor-jwt-auth.guard';
import { GetTokenUser } from '../../../decorator/get-token-user.decorator';
import { User } from '../../../interfaces/user/user.interface';

@Controller('order')
export class OrderController {
  private logger = new Logger(OrderController.name);

  constructor(private orderService: OrderService) {}

  /**
   * addOrder
   * insertManyOrder
   */

  @Post('/update-order-no')
  @UsePipes(ValidationPipe)
  async updateOrderNo(
    @Body()
    updateOrderNoDto: UpdateOrderNoDto,
  ): Promise<ResponsePayload> {
    return await this.orderService.updateOrderNo(updateOrderNoDto);
  }

  @Post('/add')
  @UsePipes(ValidationPipe)
  // @AdminMetaRoles(AdminRoles.SUPER_ADMIN)
  // @UseGuards(AdminRolesGuard)
  // @AdminMetaPermissions(AdminPermissions.CREATE)
  // @UseGuards(AdminPermissionGuard)
  // @UseGuards(AdminJwtAuthGuard)
  async addOrder(
    @Body()
    addOrderDto: AddOrderDto,
  ): Promise<ResponsePayload> {
    return await this.orderService.addOrder(addOrderDto);
  }

  @Post('/add-order-by-user')
  @UsePipes(ValidationPipe)
  @UseGuards(UserJwtAuthGuard)
  async addOrderByUser(
    @Body()
    addOrderDto: AddOrderDto,
    @GetTokenUser() user: User,
  ): Promise<ResponsePayload> {
    return await this.orderService.addOrderByUser(addOrderDto, user);
  }

  @Post('/insert-many')
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.CREATE)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminJwtAuthGuard)
  async insertManyOrder(
    @Body()
    body: {
      data: AddOrderDto[];
      option: OptionOrderDto;
    },
  ): Promise<ResponsePayload> {
    return await this.orderService.insertManyOrder(body.data, body.option);
  }

  /**
   * getAllOrders
   * getOrderById
   */
  @Version(VERSION_NEUTRAL)
  @Post('/get-all')
  @UsePipes(ValidationPipe)
  async getAllOrders(
    @Body() filterOrderDto: FilterAndPaginationOrderDto,
    @Query('q') searchString: string,
  ): Promise<ResponsePayload> {
    return this.orderService.getAllOrders(filterOrderDto, searchString);
  }

  @Post('/get-orders-by-user')
  @UsePipes(ValidationPipe)
  @UseGuards(UserJwtAuthGuard)
  async getOrdersByUser(
    @GetTokenUser() user: User,
    @Body() filterOrderDto: FilterAndPaginationOrderDto,
    @Query('q') searchString: string,
  ): Promise<ResponsePayload> {
    return await this.orderService.getOrdersByUser(
      user,
      filterOrderDto,
      searchString,
    );
  }

  @Post('/get-all-orders-by-vendor')
  @UsePipes(ValidationPipe)
  @UseGuards(VendorJwtAuthGuard)
  async getAllOrdersByVendor(
    @GetTokenUser() vendor: Vendor,
    @Body() filterOrderDto: FilterAndPaginationOrderDto,
    @Query('q') searchString: string,
  ): Promise<ResponsePayload> {
    return await this.orderService.getAllOrdersByVendor(
      vendor,
      filterOrderDto,
      searchString,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Get('/get-all-vendor-orders-by-admin/:vendorId')
  async getAllVendorOrdersByAdmin(
    @Param('id', MongoIdValidationPipe) vendorId: string,
  ): Promise<ResponsePayload> {
    return await this.orderService.getAllVendorOrdersByAdmin(vendorId);
  }

  @Version(VERSION_NEUTRAL)
  @Get('/get-all-orders-of-vendor/:vendorId')
  async getAllOrdersOfVendor(
    @Param('id', MongoIdValidationPipe) vendorId: string,
  ): Promise<ResponsePayload> {
    return await this.orderService.getAllOrdersOfVendor(vendorId);
  }

  @Version(VERSION_NEUTRAL)
  @Get('/get-all-transactions-by-vendor')
  async getAllTransactionByVendor(
    @Param('id', MongoIdValidationPipe) vendorId: string,
  ): Promise<ResponsePayload> {
    return await this.orderService.getAllTransactionByVendor(vendorId);
  }

  @Version(VERSION_NEUTRAL)
  @Get('/get-all-vendor-transactions-by-admin/:vendorId')
  async getAllVendorTransactionByAdmin(
    @Param('id', MongoIdValidationPipe) vendorId: string,
  ): Promise<ResponsePayload> {
    return await this.orderService.getAllVendorTransactionByAdmin(vendorId);
  }

  @Version(VERSION_NEUTRAL)
  @Get('/:id')
  async getOrderById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query() select: string,
  ): Promise<ResponsePayload> {
    return await this.orderService.getOrderById(id, select);
  }

  /**
   * updateOrderById
   * updateMultipleOrderById
   */
  @Version(VERSION_NEUTRAL)
  @Put('/update/:id')
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.EDIT)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminJwtAuthGuard)
  async updateOrderById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<ResponsePayload> {
    return await this.orderService.updateOrderById(id, updateOrderDto);
  }

  @Version(VERSION_NEUTRAL)
  @Put('/update-multiple')
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.EDIT)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminJwtAuthGuard)
  async updateMultipleOrderById(
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<ResponsePayload> {
    return await this.orderService.updateMultipleOrderById(
      updateOrderDto.ids,
      updateOrderDto,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Put('/change-status/:id')
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.EDIT)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminJwtAuthGuard)
  async changeOrderStatus(
    @Param('id', MongoIdValidationPipe) id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ): Promise<ResponsePayload> {
    return await this.orderService.changeOrderStatus(id, updateOrderStatusDto);
  }

  /**
   * deleteOrderById
   * deleteMultipleOrderById
   */
  @Version(VERSION_NEUTRAL)
  @Delete('/delete/:id')
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.DELETE)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminJwtAuthGuard)
  async deleteOrderById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query('checkUsage') checkUsage: boolean,
  ): Promise<ResponsePayload> {
    return await this.orderService.deleteOrderById(id, Boolean(checkUsage));
  }

  @Version(VERSION_NEUTRAL)
  @Post('/delete-multiple')
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.DELETE)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminJwtAuthGuard)
  async deleteMultipleOrderById(
    @Body() data: { ids: string[] },
    @Query('checkUsage') checkUsage: boolean,
  ): Promise<ResponsePayload> {
    return await this.orderService.deleteMultipleOrderById(
      data.ids,
      Boolean(checkUsage),
    );
  }
}
