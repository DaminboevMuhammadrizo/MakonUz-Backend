import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt } from 'class-validator';

export class GetAllPlaceDto {

    @IsString()
    @IsOptional()
    search?: string

    @ApiPropertyOptional()
    @IsOptional()
    @IsInt()
    page?: number = 1;

    @ApiPropertyOptional()
    @IsOptional()
    @IsInt()
    limit?: number = 10;

    @ApiProperty()
    @IsInt()
    categoryId: number
}
