import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from './pagination.dto';

export class AddOtpDto {
  @IsNotEmpty()
  @IsString()
  phoneNo: string;
}

export class ValidateOtpDto {
  @IsNotEmpty()
  @IsString()
  phoneNo: string;

  @IsNotEmpty()
  @IsString()
  code: string;
}

export class FilterOtpDto {
  @IsOptional()
  @IsString()
  phoneNo: string;
}

export class OptionOtpDto {
  @IsOptional()
  @IsBoolean()
  deleteMany: boolean;
}

export class UpdateOtpDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  phoneNo: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  ids: string[];
}

export class FilterAndPaginationOtpDto {
  @IsOptional()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => FilterOtpDto)
  filter: FilterOtpDto;

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
