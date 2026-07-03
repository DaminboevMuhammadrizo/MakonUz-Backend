import { IsMobilePhone, IsString, MaxLength, MinLength } from "class-validator"

export class CreateManagerDto {

    @IsString()
    @MaxLength(22)
    fullname: string

    @IsMobilePhone("uz-UZ")
    phone: string

    @IsString()
    @MinLength(6)
    pass: string
}
