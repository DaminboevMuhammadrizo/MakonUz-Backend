import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/Database/prisma.service';
import { R2Service } from 'src/infra/r2/r2.service';
import { GetAllPlaceCategoryDto } from './dto/get.all.dto';
import { UpdatePlaceCategoryDto } from './dto/update.dto';
import { CreatePlaceCategoryDto } from './dto/create.dto';

@Injectable()
export class PlaceCategoryService {
    constructor(private readonly prisma: PrismaService, private readonly r2: R2Service) { }

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
            data: { ...payload, img: img ? await this.r2.upload(img) : undefined }
        })
    }

    async update(id: number, payload: UpdatePlaceCategoryDto, img?: Express.Multer.File) {
        return await this.prisma.placeCategory.update({
            where: { id },
            data: { ...payload, img: img ? await this.r2.upload(img) : undefined }
        })
    }

    async delete(id: number) {
        const category = await this.prisma.placeCategory.delete({ where: { id } })
        if (category.img) await this.r2.delete(category.img)
        return category
    }
}
