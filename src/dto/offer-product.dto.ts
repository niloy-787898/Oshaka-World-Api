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




export class AddOfferProductDto {

  @IsNotEmpty()
  @IsString()
  name: string

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  description:string

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  category: string

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  promotionalOffer: string

  @IsOptional()
  @IsNotEmpty()
  @IsString() 
  promotionalOfferSlug: string

  @IsOptional()
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  products: [string]

}


export class FilterOfferProductDto {
  @IsOptional()
  @IsString()
  storeName: string;

  @IsOptional()
  @IsString()
  district : string

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  products : [string]


}

export class OptionOfferProductDto {
  @IsOptional()
  @IsBoolean()
  deleteMany: boolean;
}

export class UpdateOfferProductDto {

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name: string

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  description:string

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  category: string

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  promotionalOffer: string

  @IsOptional()
  @IsNotEmpty()
  @IsString() 
  promotionalOfferSlug: string

  @IsOptional()
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  products: [string]

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  ids: string[];
}

export class FilterAndPaginationOfferProductDto {
  @IsOptional()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => FilterOfferProductDto)
  filter: FilterOfferProductDto;

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
