import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
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

export class AddFeaturedProductDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  priority?: number;
  
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  product?: string;
}

export class FilterFeaturedProductDto {

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  product?: string;
}

export class OptionFeaturedProductDto {
  @IsOptional()
  @IsBoolean()
  deleteMany: boolean;
}

export class UpdateFeaturedProductDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  priority?: number;
  
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  product?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  ids: string[];
}

export class FilterAndPaginationFeaturedProductDto {
  @IsOptional()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => FilterFeaturedProductDto)
  filter: FilterFeaturedProductDto;

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
