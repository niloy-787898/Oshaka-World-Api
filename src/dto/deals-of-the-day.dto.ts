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



export class AddDealsOfTheDayDto {

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  slug: string;

  @IsNotEmpty()
  @IsString()
  desc: string;


  @IsNotEmpty()
  @IsString()
  startDate: string;


  @IsNotEmpty()
  @IsString()
  endDate: string;

  @IsNotEmpty()
  @IsString()
  priority: number;

  @IsNotEmpty()
  @IsString()
  product:string;

}


export class FilterDealsOfTheDayDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  startDate: string;

  @IsOptional()
  @IsString()
  endDate: string;

}

export class OptionDealsOfTheDayDto {
  @IsOptional()
  @IsBoolean()
  deleteMany: boolean;
}

export class UpdateDealsOfTheDayDto {

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  slug: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  desc: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  startDate: string;


  @IsOptional()
  @IsNotEmpty()
  @IsString()
  endDate: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  priority: number;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  product:string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  ids: string[];
  
}

export class FilterAndPaginationDealsOfTheDayDto {
  @IsOptional()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => FilterDealsOfTheDayDto)
  filter: FilterDealsOfTheDayDto;

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
