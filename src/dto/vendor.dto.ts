import {
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { GenderTypes } from '../enum/gender-types.enum';
import { Type } from 'class-transformer';
import { PaginationDto } from './pagination.dto';

export class CreateVendorDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  vendorName: string;

  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(11)
  phoneNo: string;

  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  password: string;

  // @IsOptional()
  // @IsString()
  // @IsIn([GenderTypes.MALE, GenderTypes.FEMALE, GenderTypes.OTHER])
  // gender: string;
}

export class CreateSocialVendorDto {
  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(100)
  vendorName: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  registrationType: string;

  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(11)
  phoneNo: string;
}

export class CheckVendorRegistrationDto {
  @IsNotEmpty()
  @IsString()
  // @MinLength(5)
  // @MaxLength(20)
  phoneNo: string;
}

export class AuthVendorDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  vendorName: string;

  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  password: string;
}

export class AuthSocialVendorDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(100)
  vendorName: string;
}

export class VendorSelectFieldDto {
  @IsOptional()
  @Matches(/^((?!password).)*$/)
  select: string;
}

export class FilterVendorDto {
  @IsOptional()
  @IsBoolean()
  hasAccess: boolean;

  @IsOptional()
  @IsString()
  @IsIn([GenderTypes.MALE, GenderTypes.FEMALE, GenderTypes.OTHER])
  gender: string;

  @IsOptional()
  _id: any;
}

export class FilterAndPaginationVendorDto {
  @IsOptional()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => FilterVendorDto)
  filter: FilterVendorDto;

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

export class UpdateVendorDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  vendorName: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  password: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  newPassword: string;

  @IsOptional()
  @IsOptional()
  @IsString()
  @IsIn([GenderTypes.MALE, GenderTypes.FEMALE, GenderTypes.OTHER])
  gender: string;
}
/**
 * Address dto
 */

export class AddAddressDto {
  @IsOptional()
  @IsString()
  vendor: string;

  @IsNotEmpty()
  phone: string;

  @IsOptional()
  @IsString()
  city: string;

  @IsOptional()
  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  addressType: string;
}

export class UpdateAddressDto {
  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(11)
  phoneNo: string;

  @IsOptional()
  @IsString()
  city: string;

  @IsOptional()
  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  addressType: string;
}

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  password: string;

  @IsNotEmpty()
  @IsString()
  phoneNo: string;
}

export class CheckVendorDto {
  @IsNotEmpty()
  @IsString()
  phoneNo: string;

  @IsNotEmpty()
  @IsString()
  email: string;
}
