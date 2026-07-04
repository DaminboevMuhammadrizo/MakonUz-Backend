import { IsString } from "class-validator"

export class CreatePlaceCategoryDto {

    @IsString()
    nameUz: string

    @IsString()
    nameRu: string

    @IsString()
    nameEn: string
}
