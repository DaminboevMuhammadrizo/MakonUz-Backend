import { IsMobilePhone, IsOptional, IsString, MaxLength, MinLength } from "class-validator"

export class UpdateManagerDto {

    @IsString()
    @IsOptional()
    @MaxLength(22)
    fullname?: string

    @IsMobilePhone("uz-UZ")
    @IsOptional()
    phone?: string

    @IsString()
    @IsOptional()
    @MinLength(6)
    pass?: string
}
