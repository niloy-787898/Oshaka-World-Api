import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ResponsePayload } from '../../../interfaces/core/response-payload.interface';
import { CategoryMenu } from '../../../interfaces/common/category-menu.interface';
import {
  AddCategoryMenuDto,
  UpdateCategoryMenuDto,
} from '../../../dto/category-menu.dto';

@Injectable()
export class CategoryMenuService {
  private logger = new Logger(CategoryMenuService.name);

  constructor(
    @InjectModel('CategoryMenu')
    private readonly categoryMenuModel: Model<CategoryMenu>,
  ) {}

  /**
   * addCategoryMenu
   * insertManyCategoryMenu
   */
  async addCategoryMenu(
    addCategoryMenuDto: AddCategoryMenuDto,
  ): Promise<ResponsePayload> {
    try {
      const dataModel = new this.categoryMenuModel(addCategoryMenuDto);
      await dataModel.save();

      return {
        success: true,
        message: 'Data Added Success',
      } as ResponsePayload;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * getAllCategoryMenus()
   */

  async getAllCategoryMenus(): Promise<ResponsePayload> {
    try {
      const data = await this.categoryMenuModel.find();

      return {
        data: data,
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async getCategoryMenuById(id: string): Promise<ResponsePayload> {
    try {
      const data = await this.categoryMenuModel.findById(id);
      return {
        success: true,
        message: 'Success',
        data,
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  /**
   * updateCategoryMenuById
   * updateMultipleCategoryMenuById
   */
  async updateCategoryMenuById(
    id: string,
    updateCategoryMenuDto: UpdateCategoryMenuDto,
  ): Promise<ResponsePayload> {
    try {
      await this.categoryMenuModel.findByIdAndUpdate(id, {
        $set: updateCategoryMenuDto,
      });
      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  /**
   * deleteCategoryMenuById
   * deleteMultipleCategoryMenuById
   */
  async deleteCategoryMenuById(id: string): Promise<ResponsePayload> {
    try {
      await this.categoryMenuModel.findByIdAndDelete(id);
      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
