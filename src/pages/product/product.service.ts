import {
  BadRequestException,
  CACHE_MANAGER,
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { UtilsService } from '../../shared/utils/utils.service';
import { Product } from '../../interfaces/common/product.interface';
import { ResponsePayload } from '../../interfaces/core/response-payload.interface';
import { ErrorCodes } from '../../enum/error-code.enum';
import {
  AddProductDto,
  FilterAndPaginationProductDto,
  GetProductByIdsDto,
  OptionProductDto,
  UpdateProductDto,
} from '../../dto/product.dto';
import { Cache } from 'cache-manager';
import { Category } from '../../interfaces/common/category.interface';
import { Brand } from '../../interfaces/common/brand.interface';

const ObjectId = Types.ObjectId;

@Injectable()
export class ProductService {
  private logger = new Logger(ProductService.name);
  private readonly cacheProductPage = 'getAllProducts?page=1';
  private readonly cacheProductCount = 'getAllProducts?count';

  constructor(
    @InjectModel('Product') private readonly productModel: Model<Product>,
    @InjectModel('Category') private readonly categoryModel: Model<Category>,
    @InjectModel('Brand') private readonly brandModel: Model<Brand>,
    private configService: ConfigService,
    private utilsService: UtilsService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  /**
   * addProduct
   * insertManyProduct
   */
  async addProduct(addProductDto: AddProductDto): Promise<ResponsePayload> {
    try {
      const { quantity, slug } = addProductDto;

      let finalSlug;
      const fData = await this.productModel.findOne({ slug: slug });

      if (fData) {
        finalSlug = this.utilsService.transformToSlug(slug, true);
      } else {
        finalSlug = slug;
      }

      const defaultData = {
        slug: finalSlug,
        quantity: quantity ? quantity : 0,
      };
      const mData = {
        ...addProductDto,
        ...defaultData,
        createdAtString: this.utilsService.getDateString(new Date()),
      };
      const newData = new this.productModel(mData);

      const saveData = await newData.save();
      const data = {
        _id: saveData._id,
      };

      // Cache Removed
      await this.cacheManager.del(this.cacheProductPage);
      await this.cacheManager.del(this.cacheProductCount);
      this.logger.log('Cache Removed');

      return {
        success: true,
        message: 'Data Added Success',
        data,
      } as ResponsePayload;
    } catch (error) {
      if (error.code && error.code.toString() === ErrorCodes.UNIQUE_FIELD) {
        if (error.keyPattern.sku) {
          throw new ConflictException('SKU   Must be Unique');
        }
        throw new ConflictException('Slug Must be Unique');
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }

  async cloneSingleProduct(id: string): Promise<ResponsePayload> {
    try {
      const data = await this.productModel.findById(id);
      const jData = JSON.stringify(data);
      const product = JSON.parse(jData);

      product.name = `${product.name}(Clone-${this.utilsService.getRandomInt(
        0,
        100,
      )})`;
      product.slug = this.utilsService.transformToSlug(product.name, true);
      product.sku = `${product.sku}-${this.utilsService.getRandomInt(0, 100)}`;
      product.quantity = 0;
      delete product._id;
      delete product.createdAt;
      delete product.updatedAt;

      const newData = new this.productModel(product);
      const saveData = await newData.save();

      const response = {
        _id: saveData._id,
      };

      // Cache Removed
      await this.cacheManager.del(this.cacheProductPage);
      await this.cacheManager.del(this.cacheProductCount);
      this.logger.log('Cache Removed');

      return {
        success: true,
        message: 'Data Clone Success',
        data: response,
      } as ResponsePayload;
    } catch (error) {
      console.log(error);
      // console.log(error);
      if (error.code && error.code.toString() === ErrorCodes.UNIQUE_FIELD) {
        throw new ConflictException('Slug Must be Unique');
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }

  async insertManyProduct(
    addProductsDto: AddProductDto[],
    optionProductDto: OptionProductDto,
  ): Promise<ResponsePayload> {
    const { deleteMany } = optionProductDto;
    if (deleteMany) {
      await this.productModel.deleteMany({});
    }
    const mData = addProductsDto.map((m) => {
      return {
        ...m,
        ...{
          slug: this.utilsService.transformToSlug(m.name),
        },
      };
    });
    try {
      const saveData = await this.productModel.insertMany(mData);

      // Cache Removed
      await this.cacheManager.del(this.cacheProductPage);
      await this.cacheManager.del(this.cacheProductCount);
      this.logger.log('Cache Removed');

      return {
        success: true,
        message: `${
          saveData && saveData.length ? saveData.length : 0
        }  Data Added Success`,
      } as ResponsePayload;
    } catch (error) {
      // console.log(error);
      if (error.code && error.code.toString() === ErrorCodes.UNIQUE_FIELD) {
        throw new ConflictException('Slug Must be Unique');
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }

  /**
   * getAllProducts
   * getProductById
   */
  async getAllProducts(
    filterProductDto: FilterAndPaginationProductDto,
    searchQuery?: string,
  ): Promise<ResponsePayload> {
    const { filter } = filterProductDto;
    const { pagination } = filterProductDto;
    const { sort } = filterProductDto;
    const { select } = filterProductDto;
    const { filterGroup } = filterProductDto;

    // if (
    //   pagination.currentPage < 1 &&
    //   filter == null &&
    //   JSON.stringify(sort) == JSON.stringify({ createdAt: -1 })
    // ) {
    //   const cache: object[] = await this.cacheManager.get(
    //     this.cacheProductPage,
    //   );
    //   const count: number = await this.cacheManager.get(this.cacheProductCount);
    //   if (cache) {
    //     this.logger.log('Cached page');
    //     return {
    //       data: cache,
    //       success: true,
    //       message: 'Success',
    //       count: count,
    //     } as ResponsePayload;
    //   }
    // }
    this.logger.log('Not a Cached page');
    // Modify Id as Object ID
    if (filter && filter['category._id']) {
      filter['category._id'] = new ObjectId(filter['category._id']);
    }

    if (filter && filter['subCategory._id']) {
      filter['subCategory._id'] = new ObjectId(filter['subCategory._id']);
    }

    if (filter && filter['brand._id']) {
      filter['brand._id'] = new ObjectId(filter['brand._id']);
    }

    if (filter && filter['tags']) {
      filter['tags'] = new ObjectId(filter['tags']);
    }

    // Aggregate Stages
    const aggregateStages = [];
    const aggregateCategoryGroupStages = [];
    const aggregateBrandGroupStages = [];
    const aggregateSubCategoryGroupStages = [];

    // Essential Variables
    let mFilter = {};
    let mSort = {};
    let mSelect = {};
    let mPagination = {};

    // Match
    if (filter) {
      mFilter = { ...mFilter, ...filter };
    }
    if (searchQuery) {
      mFilter = {
        $and: [
          mFilter,
          {
            $or: [
              { name: { $regex: searchQuery, $options: 'i' } },
              { 'category.name': { $regex: searchQuery, $options: 'i' } },
            ],
          },
        ],
      };
      // mFilter = { ...mFilter, ...{ name: new RegExp(searchQuery, 'i') } };
    }
    // Sort
    if (sort) {
      mSort = sort;
    } else {
      mSort = { createdAt: -1 };
    }

    // Select
    if (select) {
      mSelect = { ...select };
    } else {
      mSelect = { name: 1 };
    }

    // GROUPING FOR FILTER PRODUCTS
    let groupCategory;
    let groupBrand;
    let groupSubCategory;

    if (filterGroup && filterGroup.isGroup) {
      if (filterGroup.category) {
        groupCategory = {
          $group: {
            _id: { category: '$category._id' },
            name: { $first: '$category.name' },
            slug: { $first: '$category.slug' },
            total: { $sum: 1 },
          },
        };
      }

      if (filterGroup.brand) {
        groupBrand = {
          $group: {
            _id: { brand: '$brand._id' },
            name: { $first: '$brand.name' },
            slug: { $first: '$brand.slug' },
            total: { $sum: 1 },
          },
        };
      }

      if (filterGroup.subCategory) {
        groupSubCategory = {
          $group: {
            _id: { subCategory: '$subCategory._id' },
            name: { $first: '$subCategory.name' },
            slug: { $first: '$subCategory.slug' },
            total: { $sum: 1 },
          },
        };
      }
    }

    // Finalize
    if (Object.keys(mFilter).length) {
      // Main
      aggregateStages.push({ $match: mFilter });

      // Category Groups
      if (groupCategory) {
        // aggregateCategoryGroupStages.push({ $match: mFilter });
        aggregateCategoryGroupStages.push(groupCategory);
      }

      // Sub Category Groups
      if (groupSubCategory) {
        // aggregateSubCategoryGroupStages.push({ $match: mFilter });
        aggregateSubCategoryGroupStages.push(groupSubCategory);
      }

      // Brand Groups
      if (groupBrand) {
        // aggregateBrandGroupStages.push({ $match: mFilter });
        aggregateBrandGroupStages.push(groupBrand);
      }
    } else {
      if (groupCategory) {
        aggregateCategoryGroupStages.push(groupCategory);
      }
      if (groupSubCategory) {
        aggregateSubCategoryGroupStages.push(groupSubCategory);
      }
      if (groupBrand) {
        aggregateBrandGroupStages.push(groupBrand);
      }
    }

    if (Object.keys(mSort).length) {
      aggregateStages.push({ $sort: mSort });
    }

    if (!pagination) {
      aggregateStages.push({ $project: mSelect });
    }

    // Pagination
    if (pagination) {
      if (Object.keys(mSelect).length) {
        mPagination = {
          $facet: {
            metadata: [{ $count: 'total' }],
            data: [
              {
                $skip: pagination.pageSize * pagination.currentPage,
              } /* IF PAGE START FROM 0 OR (pagination.currentPage - 1) IF PAGE 1*/,
              { $limit: pagination.pageSize },
              { $project: mSelect },
            ],
          },
        };
      } else {
        mPagination = {
          $facet: {
            metadata: [{ $count: 'total' }],
            data: [
              {
                $skip: pagination.pageSize * pagination.currentPage,
              } /* IF PAGE START FROM 0 OR (pagination.currentPage - 1) IF PAGE 1*/,
              { $limit: pagination.pageSize },
            ],
          },
        };
      }

      aggregateStages.push(mPagination);

      aggregateStages.push({
        $project: {
          data: 1,
          count: { $arrayElemAt: ['$metadata.total', 0] },
        },
      });
    }

    try {
      // Main
      const dataAggregates = await this.productModel.aggregate(aggregateStages);

      // GROUP FILTER PRODUCTS DATA
      let categoryAggregates;
      let subCategoryAggregates;
      let brandAggregates;
      // Category
      if (filterGroup && filterGroup.isGroup && filterGroup.category) {
        categoryAggregates = await this.productModel.aggregate(
          aggregateCategoryGroupStages,
        );
      }

      // Sub Category
      if (filterGroup && filterGroup.isGroup && filterGroup.subCategory) {
        subCategoryAggregates = await this.productModel.aggregate(
          aggregateSubCategoryGroupStages,
        );
      }

      // Brand
      if (filterGroup && filterGroup.isGroup && filterGroup.brand) {
        brandAggregates = await this.productModel.aggregate(
          aggregateBrandGroupStages,
        );
      }

      // Main Filter Data
      let allFilterGroups;
      if (filterGroup && filterGroup.isGroup) {
        allFilterGroups = {
          categories:
            categoryAggregates && categoryAggregates.length
              ? categoryAggregates
              : [],
          subCategories:
            subCategoryAggregates && subCategoryAggregates.length
              ? subCategoryAggregates
              : [],
          brands:
            brandAggregates && brandAggregates.length ? brandAggregates : [],
        };
      } else {
        allFilterGroups = null;
      }

      if (pagination) {
        if (
          pagination.currentPage < 1 &&
          filter == null &&
          JSON.stringify(sort) == JSON.stringify({ createdAt: -1 })
        ) {
          await this.cacheManager.set(
            this.cacheProductPage,
            dataAggregates[0].data,
          );
          await this.cacheManager.set(
            this.cacheProductCount,
            dataAggregates[0].count,
          );
          this.logger.log('Cache Added');
        }

        return {
          ...{ ...dataAggregates[0] },
          ...{
            success: true,
            message: 'Success',
            filterGroup: allFilterGroups,
          },
        } as ResponsePayload;
      } else {
        return {
          data: dataAggregates,
          success: true,
          message: 'Success',
          count: dataAggregates.length,
          filterGroup: allFilterGroups,
        } as ResponsePayload;
      }
    } catch (err) {
      this.logger.error(err);
      if (err.code && err.code.toString() === ErrorCodes.PROJECTION_MISMATCH) {
        throw new BadRequestException('Error! Projection mismatch');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async getProductById(id: string, select: string): Promise<ResponsePayload> {
    try {
      const data = await this.productModel
        .findOne({ _id: id })
        .select(select)
        .populate('tags');

      return {
        success: true,
        message: 'Success',
        data,
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async getProductBySlug(
    slug: string,
    select: string,
  ): Promise<ResponsePayload> {
    try {
      const data = await this.productModel
        .findOne({ slug: slug })
        .select('-description')
        .populate('tags');

      return {
        success: true,
        message: 'Success',
        data,
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async getProductBySlugOnlyDescription(
    slug: string,
  ): Promise<ResponsePayload> {
    try {
      const data = await this.productModel
        .findOne({ slug: slug })
        .select('description');

      return {
        success: true,
        message: 'Success',
        data,
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async getProductByIds(
    getProductByIdsDto: GetProductByIdsDto,
    select: string,
  ): Promise<ResponsePayload> {
    try {
      const mIds = getProductByIdsDto.ids.map((m) => new ObjectId(m));
      const data = await this.productModel.find({ _id: { $in: mIds } });
      // .select(select ? select : '');
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
   * updateProductById
   * updateMultipleProductById
   */
  async updateProductById(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<ResponsePayload> {
    try {
      const { slug } = updateProductDto;

      let finalSlug;
      const fData = await this.productModel.findById(id);

      // Check Slug
      if (fData?.slug !== slug) {
        const fData = await this.productModel.findOne({ slug: slug });
        if (fData) {
          finalSlug = this.utilsService.transformToSlug(slug, true);
        } else {
          finalSlug = slug;
        }
      } else {
        finalSlug = slug;
      }

      const defaultData = {
        slug: finalSlug,
        quantity: updateProductDto.quantity ? updateProductDto.quantity : 0,
      };

      const finalData = { ...updateProductDto, ...defaultData };

      await this.productModel.findByIdAndUpdate(id, {
        $set: finalData,
      });

      // Cache Removed
      await this.cacheManager.del(this.cacheProductPage);
      await this.cacheManager.del(this.cacheProductCount);
      this.logger.log('Cache Removed');

      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  async updateMultipleProductById(
    ids: string[],
    updateProductDto: UpdateProductDto,
  ): Promise<ResponsePayload> {
    const mIds = ids.map((m) => new ObjectId(m));

    // Delete No Multiple Action Data
    if (updateProductDto.slug) {
      delete updateProductDto.slug;
    }

    try {
      await this.productModel.updateMany(
        { _id: { $in: mIds } },
        { $set: updateProductDto },
      );

      // Cache Removed
      await this.cacheManager.del(this.cacheProductPage);
      await this.cacheManager.del(this.cacheProductCount);
      this.logger.log('Cache Removed');

      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  /**
   * deleteProductById
   * deleteMultipleProductById
   */
  async deleteProductById(id: string): Promise<ResponsePayload> {
    let data;
    try {
      data = await this.productModel.findById(id);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
    if (!data) {
      throw new NotFoundException('No Data found!');
    }
    try {
      await this.productModel.findByIdAndDelete(id);

      // Cache Removed
      await this.cacheManager.del(this.cacheProductPage);
      await this.cacheManager.del(this.cacheProductCount);
      this.logger.log('Cache Removed');

      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async deleteMultipleProductById(ids: string[]): Promise<ResponsePayload> {
    try {
      await this.productModel.deleteMany({ _id: ids });

      // Cache Removed
      await this.cacheManager.del(this.cacheProductPage);
      await this.cacheManager.del(this.cacheProductCount);
      this.logger.log('Cache Removed');

      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async setProductQtyNotNull(): Promise<ResponsePayload> {
    try {
      const data1 = await this.productModel.countDocuments({});

      const data2 = await this.productModel.countDocuments({
        quantity: { $exists: true },
      });

      const data3 = await this.productModel.countDocuments({
        quantity: { $exists: false },
      });

      const data4 = await this.productModel.countDocuments({
        quantity: { $eq: null },
      });

      await this.productModel.updateMany(
        { quantity: { $eq: null } },
        {
          $set: { quantity: 0 },
        },
      );

      return {
        success: true,
        message: 'Success',
        data: {
          all: data1,
          exists: data2,
          existsNot: data3,
          nullData: data4,
        },
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async setProductImageHttpToHttps(): Promise<ResponsePayload> {
    try {
      const data1 = await this.productModel.find({});

      const mData1 = JSON.parse(JSON.stringify(data1));

      for (const product of mData1) {
        if (product.images && product.images.length) {
          const mImages = product.images.map((m) => {
            return m.replace('http://', 'https://');
          });
          await this.productModel.findByIdAndUpdate(product._id, {
            $set: {
              images: mImages,
            },
          });
        }
      }

      return {
        success: true,
        message: 'Success',
        data: null,
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
