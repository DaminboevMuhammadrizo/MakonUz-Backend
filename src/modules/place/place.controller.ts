import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { PlaceService } from './place.service';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { Status, UserRole } from '@prisma/client';
import { fileStorages } from 'src/common/types/upload_types';
import { GetAllPlaceDto } from './dto/get.all.dto';
import { GetAllPlaceFreeDto } from './dto/get.all.free.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { CreatePlaceDto } from './dto/create.dto';
import { UpdatePlaceDto } from './dto/update.dto';

const placeFilesInterceptor = FileFieldsInterceptor(
    [{ name: 'ims', maxCount: 10 }, { name: 'video', maxCount: 1 }],
    fileStorages(['image', 'video']),
)

@Controller('place')
export class PlaceController {
    constructor(private readonly service: PlaceService) { }

    @Get()
    getAll(@Query() query: GetAllPlaceDto) {
        return this.service.getAll(query)
    }

    @Get('all')
    getAllFree(@Query() query: GetAllPlaceFreeDto) {
        return this.service.getAllFree(query)
    }

    @Get(':id')
    getOne(@Param('id', ParseIntPipe) id: number) {
        return this.service.getOne(id)
    }

    @Post()
    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: `${UserRole.ADMIN}, ${UserRole.MANAGER}` })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                locationId: { type: 'number' },
                categoryId: { type: 'number' },
                price: { type: 'number' },
                priceDesc: { type: 'string' },
                title: { type: 'string' },
                desc: { type: 'string' },
                phone: { type: 'string' },
                telegram: { type: 'string' },
                link: { type: 'string' },
                status: { type: 'string', enum: Object.values(Status) },
                ims: { type: 'array', items: { type: 'string', format: 'binary' } },
                video: { type: 'string', format: 'binary' },
            },
            required: ['locationId', 'categoryId', 'price', 'title', 'desc', 'phone', 'status'],
        },
    })
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.MANAGER)
    @UseInterceptors(placeFilesInterceptor)
    create(@Body() payload: CreatePlaceDto, @UploadedFiles() files: { ims?: Express.Multer.File[], video?: Express.Multer.File[] }) {
        return this.service.create(payload, files)
    }

    @Put(':id')
    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: `${UserRole.ADMIN}, ${UserRole.MANAGER}` })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                locationId: { type: 'number' },
                categoryId: { type: 'number' },
                price: { type: 'number' },
                priceDesc: { type: 'string' },
                title: { type: 'string' },
                desc: { type: 'string' },
                phone: { type: 'string' },
                telegram: { type: 'string' },
                link: { type: 'string' },
                status: { type: 'string', enum: Object.values(Status) },
                ims: { type: 'array', items: { type: 'string', format: 'binary' } },
                video: { type: 'string', format: 'binary' },
            },
        },
    })
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.MANAGER)
    @UseInterceptors(placeFilesInterceptor)
    update(@Param('id', ParseIntPipe) id: number, @Body() payload: UpdatePlaceDto, @UploadedFiles() files: { ims?: Express.Multer.File[], video?: Express.Multer.File[] }) {
        return this.service.update(id, payload, files)
    }

    @Delete(':id')
    @ApiBearerAuth()
    @ApiOperation({ summary: `${UserRole.ADMIN}, ${UserRole.MANAGER}` })
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.MANAGER)
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.service.delete(id)
    }
}
