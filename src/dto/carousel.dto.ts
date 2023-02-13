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

export class AddCarouselDto {
  @IsNotEmpty()
  @IsString()
  title: string;
  
  @IsNotEmpty()
  @IsString()
  image : string

  @IsNotEmpty()
  @IsString()
  url:string;
}


export class FilterCarouselDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  url: string;

}

export class OptionCarouselDto {
  @IsOptional()
  @IsBoolean()
  deleteMany: boolean;
}

export class UpdateCarouselDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  title: string;
  
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  image : string

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  url:string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  ids: string[];
}

export class FilterAndPaginationCarouselDto {
  @IsOptional()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => FilterCarouselDto)
  filter: FilterCarouselDto;

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
