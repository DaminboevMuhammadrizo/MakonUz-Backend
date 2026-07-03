import { IsEnum, IsInt, IsNumber, IsOptional, IsString } from "class-validator"
import { Status } from "@prisma/client"

export class CreatePlaceDto {

    @IsInt()
    locationId: number

    @IsInt()
    categoryId: number

    @IsNumber()
    price: number

    @IsString()
    @IsOptional()
    priceDesc?: string

    @IsString()
    title: string

    @IsString()
    desc: string

    @IsString()
    phone: string

    @IsString()
    @IsOptional()
    telegram?: string

    @IsString()
    @IsOptional()
    link?: string

    @IsEnum(Status)
    status: Status
}
