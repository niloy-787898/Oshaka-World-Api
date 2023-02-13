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

export class AddFlashSaleDto {

  @IsNotEmpty()
  @IsString()
  name?: string;
  
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  slug?: string;
  
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  desc?: string;
  
  @IsNotEmpty()
  @IsString()
  startDate?: string;
  
  @IsNotEmpty()
  @IsString()
  endDate?: string;
  
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  priority?: string;
  
  @IsOptional()
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  product?: [string];

}


export class FilterFlashSaleDto {

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  startDate?: string;
  
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  endDate?: string;
  
  @IsOptional()
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  product?: [string];

}

export class OptionFlashSaleDto {
  @IsOptional()
  @IsBoolean()
  deleteMany: boolean;
}

export class UpdateFlashSaleDto {

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name?: string;
  
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  slug?: string;
  
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  desc?: string;
  
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  startDate?: string;
  
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  endDate?: string;
  
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  priority?: string;
  
  @IsOptional()
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  product?: [string];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  ids: string[];
  
}

export class FilterAndPaginationFlashSaleDto {
  @IsOptional()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => FilterFlashSaleDto)
  filter: FilterFlashSaleDto;

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
