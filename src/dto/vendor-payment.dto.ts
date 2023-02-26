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

export class AddVandorPaymentDto {
  @IsOptional()
  @IsString()
  id: string;
}

export class ValidateVandorPaymentDto {
  @IsOptional()
  @IsString()
  id: string;
}

export class FilterVandorPaymentDto {
  @IsOptional()
  @IsString()
  id: string;
}

export class OptionVandorPaymentDto {
  @IsOptional()
  @IsBoolean()
  deleteMany: boolean;
}

export class UpdateVandorPaymentDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  ids: string[];
}

export class FilterAndPaginationVandorPaymentDto {
  @IsOptional()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => FilterVandorPaymentDto)
  filter: FilterVandorPaymentDto;

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
