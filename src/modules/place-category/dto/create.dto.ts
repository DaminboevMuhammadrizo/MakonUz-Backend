import { IsString } from "class-validator"

export class CreatePlaceCategoryDto {

    @IsString()
    name: string
}
