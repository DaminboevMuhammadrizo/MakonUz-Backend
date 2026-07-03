import { IsEnum, IsInt, IsNumber, IsOptional, IsString } from "class-validator"
import { Status } from "@prisma/client"

export class UpdatePlaceDto {

    @IsInt()
    @IsOptional()
    locationId?: number

    @IsInt()
    @IsOptional()
    categoryId?: number

    @IsNumber()
    @IsOptional()
    price?: number

    @IsString()
    @IsOptional()
    priceDesc?: string

    @IsString()
    @IsOptional()
    title?: string

    @IsString()
    @IsOptional()
    desc?: string

    @IsString()
    @IsOptional()
    phone?: string

    @IsString()
    @IsOptional()
    telegram?: string

    @IsString()
    @IsOptional()
    link?: string

    @IsEnum(Status)
    @IsOptional()
    status?: Status
}
