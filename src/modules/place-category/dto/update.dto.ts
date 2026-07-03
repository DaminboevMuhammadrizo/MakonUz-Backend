import { IsOptional, IsString } from "class-validator"

export class UpdatePlaceCategoryDto {

    @IsString()
    @IsOptional()
    name?: string
}
