import { IsOptional, IsString } from "class-validator"

export class UpdatePlaceCategoryDto {

    @IsString()
    @IsOptional()
    nameUz?: string

    @IsString()
    @IsOptional()
    nameRu?: string

    @IsString()
    @IsOptional()
    nameEn?: string
}
