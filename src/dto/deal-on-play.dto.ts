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




export class AddDealOnPlayDto {

  @IsNotEmpty()
  @IsString()
  name: string;
  
  @IsNotEmpty()
  @IsString()
  slug: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  shortDesc: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  info: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  image: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  routerLink: string;
  
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  cardBackground: string;
  
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  cardBtnColor: string;
  
  @IsOptional()
  @IsNotEmpty()
  @IsArray()
  products: [string];

  @IsOptional()
  @IsNumber()
  priority : number

}


export class FilterDealOnPlayDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  author : string
}

export class OptionDealOnPlayDto {
  @IsOptional()
  @IsBoolean()
  deleteMany: boolean;
}

export class UpdateDealOnPlayDto {

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
  shortDesc: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  info: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  image: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  routerLink: string;
  
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  cardBackground: string;
  
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  cardBtnColor: string;
  
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  products: [string];

  @IsOptional()
  @IsNumber()
  priority : number


  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  ids: string[];
  
}

export class FilterAndPaginationDealOnPlayDto {
  @IsOptional()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => FilterDealOnPlayDto)
  filter: FilterDealOnPlayDto;

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
