import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/common/Database/prisma.service';
import { urlGenerator } from 'src/common/types/generator.types';
import { GetAllPlaceCategoryDto } from './dto/get.all.dto';
import { UpdatePlaceCategoryDto } from './dto/update.dto';
import { CreatePlaceCategoryDto } from './dto/create.dto';

@Injectable()
export class PlaceCategoryService {
    constructor(private readonly prisma: PrismaService, private readonly config: ConfigService) { }

    async getAll(query: GetAllPlaceCategoryDto) {
        return await this.prisma.placeCategory.findMany({
            where: {
                OR: query.search ? [
                    { nameUz: { contains: query.search, mode: 'insensitive' } },
                    { nameRu: { contains: query.search, mode: 'insensitive' } },
                    { nameEn: { contains: query.search, mode: 'insensitive' } },
                ] : undefined,
            },
            skip: ((query.page || 1) - 1) * (query.limit || 10),
            take: query.limit || 10,
        })
    }

    async create(payload: CreatePlaceCategoryDto, img?: Express.Multer.File) {
        return await this.prisma.placeCategory.create({
            data: { ...payload, img: img ? urlGenerator(this.config, img.filename) : undefined }
        })
    }

    async update(id: number, payload: UpdatePlaceCategoryDto, img?: Express.Multer.File) {
        return await this.prisma.placeCategory.update({
            where: { id },
            data: { ...payload, img: img ? urlGenerator(this.config, img.filename) : undefined }
        })
    }

    async delete(id: number) {
        return await this.prisma.placeCategory.delete({ where: { id } })
    }
}
