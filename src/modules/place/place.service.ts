import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/common/Database/prisma.service';
import { urlGenerator } from 'src/common/types/generator.types';
import { GetAllPlaceDto } from './dto/get.all.dto';
import { GetAllPlaceFreeDto } from './dto/get.all.free.dto';
import { CreatePlaceDto } from './dto/create.dto';
import { UpdatePlaceDto } from './dto/update.dto';

@Injectable()
export class PlaceService {
    constructor(private readonly prisma: PrismaService, private readonly config: ConfigService) { }

    async getAll(query: GetAllPlaceDto) {
        return await this.prisma.place.findMany({
            where: {
                categoryId: query.categoryId,
                title: query.search ? { contains: query.search, mode: 'insensitive' } : undefined,
            },
            orderBy: { views: 'desc' },
            skip: ((query.page || 1) - 1) * (query.limit || 10),
            take: query.limit || 10,
        })
    }

    async getAllFree(query: GetAllPlaceFreeDto) {
        return await this.prisma.place.findMany({
            where: {
                title: query.search ? { contains: query.search, mode: 'insensitive' } : undefined,
            },
            orderBy: { views: 'desc' },
            skip: ((query.page || 1) - 1) * (query.limit || 10),
            take: query.limit || 10,
        })
    }

    async getOne(id: number) {
        return await this.prisma.place.update({ where: { id }, data: { views: { increment: 1 } } })
    }

    async create(payload: CreatePlaceDto, files: { ims?: Express.Multer.File[], video?: Express.Multer.File[] }) {
        return await this.prisma.place.create({
            data: {
                ...payload,
                ims: files.ims?.map(file => urlGenerator(this.config, file.filename)) || [],
                video: files.video?.[0] ? urlGenerator(this.config, files.video[0].filename) : undefined,
            }
        })
    }

    async update(id: number, payload: UpdatePlaceDto, files: { ims?: Express.Multer.File[], video?: Express.Multer.File[] }) {
        return await this.prisma.place.update({
            where: { id },
            data: {
                ...payload,
                ims: files.ims?.map(file => urlGenerator(this.config, file.filename)),
                video: files.video?.[0] ? urlGenerator(this.config, files.video[0].filename) : undefined,
            }
        })
    }

    async delete(id: number) {
        return await this.prisma.place.delete({ where: { id } })
    }
}
