import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/Database/prisma.service';
import { R2Service } from 'src/infra/r2/r2.service';
import { RedisService } from 'src/infra/redis/redis.service';
import { GetAllPlaceDto } from './dto/get.all.dto';
import { GetAllPlaceFreeDto } from './dto/get.all.free.dto';
import { CreatePlaceDto } from './dto/create.dto';
import { UpdatePlaceDto } from './dto/update.dto';

const PLACE_PAGES_INDEX = 'place:pages:index'
const PLACE_PAGE_TTL = 1800

@Injectable()
export class PlaceService {
    constructor(private readonly prisma: PrismaService, private readonly r2: R2Service, private readonly redis: RedisService) { }

    async getAll(query: GetAllPlaceDto) {
        const key = `place:all:${query.categoryId}:${query.search || ''}:${query.page || 1}:${query.limit || 10}`
        return await this.redis.getOrSet(key, PLACE_PAGES_INDEX, PLACE_PAGE_TTL, () => this.prisma.place.findMany({
            where: {
                categoryId: query.categoryId,
                title: query.search ? { contains: query.search, mode: 'insensitive' } : undefined,
            },
            orderBy: { views: 'desc' },
            skip: ((query.page || 1) - 1) * (query.limit || 10),
            take: query.limit || 10,
        }))
    }

    async getAllFree(query: GetAllPlaceFreeDto) {
        const key = `place:free:${query.search || ''}:${query.page || 1}:${query.limit || 10}`
        return await this.redis.getOrSet(key, PLACE_PAGES_INDEX, PLACE_PAGE_TTL, () => this.prisma.place.findMany({
            where: {
                title: query.search ? { contains: query.search, mode: 'insensitive' } : undefined,
            },
            orderBy: { views: 'desc' },
            skip: ((query.page || 1) - 1) * (query.limit || 10),
            take: query.limit || 10,
        }))
    }

    async getOne(id: number) {
        return await this.prisma.place.update({ where: { id }, data: { views: { increment: 1 } } })
    }

    async create(payload: CreatePlaceDto, files: { ims?: Express.Multer.File[], video?: Express.Multer.File[] }) {
        const place = await this.prisma.place.create({
            data: {
                ...payload,
                ims: files.ims ? await Promise.all(files.ims.map(file => this.r2.upload(file))) : [],
                video: files.video?.[0] ? await this.r2.upload(files.video[0]) : undefined,
            }
        })
        await this.redis.invalidate(PLACE_PAGES_INDEX)
        return place
    }

    async update(id: number, payload: UpdatePlaceDto, files: { ims?: Express.Multer.File[], video?: Express.Multer.File[] }) {
        const place = await this.prisma.place.update({
            where: { id },
            data: {
                ...payload,
                ims: files.ims ? await Promise.all(files.ims.map(file => this.r2.upload(file))) : undefined,
                video: files.video?.[0] ? await this.r2.upload(files.video[0]) : undefined,
            }
        })
        await this.redis.invalidate(PLACE_PAGES_INDEX)
        return place
    }

    async delete(id: number) {
        const place = await this.prisma.place.delete({ where: { id } })
        await Promise.all(place.ims.map(url => this.r2.delete(url)))
        if (place.video) await this.r2.delete(place.video)
        await this.redis.invalidate(PLACE_PAGES_INDEX)
        return place
    }
}
