import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean, IsDate,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from './pagination.dto';

export class AddReviewDto {
  @IsOptional()
  @IsString()
  user: string;

  @IsOptional()
  @IsString()
  product: string;

  @IsOptional()
  @IsString()
  review: string;

  @IsOptional()
  @IsNumber()
  rating: string;

  @IsOptional()
  @IsString()
  reply: string;

  @IsOptional()
  @IsString()
  replyDate: string;

   @IsOptional()
  @IsString()
   name: string;


}

export class FilterReviewDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsBoolean()
  visibility: boolean;

  @IsOptional()
  @IsNumber()
  quantity: number;

  @IsOptional()
  @IsNumber()
  price: number;
}

export class FilterReviewGroupDto {
  @IsOptional()
  @IsBoolean()
  isGroup: boolean;

  @IsOptional()
  @IsBoolean()
  category: boolean;

  @IsOptional()
  @IsBoolean()
  subCategory: boolean;

  @IsOptional()
  @IsBoolean()
  brand: boolean;
}

export class OptionReviewDto {
  @IsOptional()
  @IsBoolean()
  deleteMany: boolean;
}

export class UpdateReviewDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  review: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  rating: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  reply: string;

  @IsOptional()
  @IsNotEmpty()
  @IsBoolean()
  status: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  ids: string[];
}

export class GetReviewByIdsDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(100)
  ids: string[];
}

export class FilterAndPaginationReviewDto {
  @IsOptional()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => FilterReviewDto)
  filter: FilterReviewDto;

  @IsOptional()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => FilterReviewGroupDto)
  filterGroup: FilterReviewGroupDto;

  @IsOptional()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => PaginationDto)
  pagination: PaginationDto;

  @IsOptional()
  @IsNotEmptyObject()
  @IsObject()
  sort: object;

  @IsOptional()
  @IsNotEmptyObject()
  @IsObject()
  select: any;
}
