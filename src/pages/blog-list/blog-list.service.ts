import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ResponsePayload } from '../../interfaces/core/response-payload.interface';
import { Cache } from 'cache-manager';
import { BlogList } from '../../interfaces/core/blog-list.interface';
import {
  AddBlogListDto,
  UpdateBlogListDto,
} from '../../dto/blog-list.dto';

const ObjectId = Types.ObjectId;

@Injectable()
export class BlogListService {
  private logger = new Logger(BlogListService.name);
  // Cache
  private readonly cacheAllData = 'getAllBlogList';
  private readonly cacheDataCount = 'getCountBlogList';

  constructor(
    @InjectModel('BlogList')
    private readonly blogListModel: Model<BlogList>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  /**
   * addBlogList
   * insertManyBlogList
   */
  async addBlogList(
    addBlogListDto: AddBlogListDto,
  ): Promise<ResponsePayload> {
    try {
      const pageInfo = await this.blogListModel.findOne({
        slug: addBlogListDto.slug,
      });
      if (pageInfo) {
        await this.blogListModel.findOneAndUpdate(
          { slug: addBlogListDto.slug },
          {
            $set: addBlogListDto,
          },
        );
        return {
          success: true,
          message: 'Data Updated Success',
          data: null,
        } as ResponsePayload;
      } else {
        const newData = new this.blogListModel(addBlogListDto);
        const saveData = await newData.save();
        const data = {
          _id: saveData._id,
        };

        return {
          success: true,
          message: 'Data Added Success',
          data,
        } as ResponsePayload;
      }

      // Cache Removed
      await this.cacheManager.del(this.cacheAllData);
      await this.cacheManager.del(this.cacheDataCount);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * getAllBlogLists
   * getBlogListById
   */

  async getBlogListBySlug(
    slug: string,
    select: string,
  ): Promise<ResponsePayload> {
    try {
      const data = await this.blogListModel
        .findOne({ slug })
        .select(select);
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
   * updateBlogListById
   * updateMultipleBlogListById
   */
  async updateBlogListBySlug(
    slug: string,
    updateBlogListDto: UpdateBlogListDto,
  ): Promise<ResponsePayload> {
    let data;
    try {
      data = await this.blogListModel.findOne({ slug });
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
    if (!data) {
      throw new NotFoundException('No Data found!');
    }
    try {
      await this.blogListModel.findOneAndUpdate(
        { slug },
        {
          $set: updateBlogListDto,
        },
      );
      // Cache Removed
      await this.cacheManager.del(this.cacheAllData);
      await this.cacheManager.del(this.cacheDataCount);

      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  /**
   * deleteBlogListById
   * deleteMultipleBlogListById
   */
  async deleteBlogListBySlug(
    slug: string,
    checkUsage: boolean,
  ): Promise<ResponsePayload> {
    try {
      await this.blogListModel.findOneAndDelete({ slug });
      // Cache Removed
      await this.cacheManager.del(this.cacheAllData);
      await this.cacheManager.del(this.cacheDataCount);

      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
