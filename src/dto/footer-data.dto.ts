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

export class AddFooterDataDto {
  @IsNotEmpty()
  @IsString()
  shortDes: string;
}


export class FilterFooterDataDto {
  @IsOptional()
  @IsString()
  shortDes: string;

  @IsOptional()
  @IsBoolean()
  address: boolean;

  @IsOptional()
  @IsNumber()
  phone: string;

  @IsOptional()
  @IsNumber()
  email: string;
}

export class OptionFooterDataDto {
  @IsOptional()
  @IsBoolean()
  deleteMany: boolean;
}

export class UpdateFooterDataDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  shortDes: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  slug: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  ids: string[];
}

export class FilterAndPaginationFooterDataDto {
  @IsOptional()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => FilterFooterDataDto)
  filter: FilterFooterDataDto;

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
