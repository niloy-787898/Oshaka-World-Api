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



export class AddSettingDto {

  @IsOptional()
  @IsNotEmpty()
  @IsBoolean()
  cashOnDelivery: boolean;
  
  @IsOptional()
  @IsNotEmpty()
  @IsBoolean()
  onlinePayment: boolean;

}


export class FilterSettingDto {
  @IsOptional()
  @IsNotEmpty()
  @IsBoolean()
  cashOnDelivery: boolean;
  
  @IsOptional()
  @IsNotEmpty()
  @IsBoolean()
  onlinePayment: boolean;
}

export class OptionSettingDto {
  @IsOptional()
  @IsBoolean()
  deleteMany: boolean;
}

export class UpdateSettingDto {

  @IsOptional()
  @IsNotEmpty()
  @IsBoolean()
  cashOnDelivery: boolean;
  
  @IsOptional()
  @IsNotEmpty()
  @IsBoolean()
  onlinePayment: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  ids: string[];
  
}

export class FilterAndPaginationSettingDto {
  @IsOptional()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => FilterSettingDto)
  filter: FilterSettingDto;

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
