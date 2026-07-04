import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PlaceCategoryService } from './place-category.service';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { UserRole } from '@prisma/client';
import { GetAllPlaceCategoryDto } from './dto/get.all.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { UpdatePlaceCategoryDto } from './dto/update.dto';
import { CreatePlaceCategoryDto } from './dto/create.dto';

@Controller('place-category')
export class PlaceCategoryController {
    constructor(private readonly service: PlaceCategoryService) { }

    @Get()
    getAll(@Query() query: GetAllPlaceCategoryDto) {
        return this.service.getAll(query)
    }

    @Post()
    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: `${UserRole.ADMIN}` })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                nameUz: { type: 'string' },
                nameRu: { type: 'string' },
                nameEn: { type: 'string' },
                img: { type: 'string', format: 'binary' },
            },
            required: ['nameUz', 'nameRu', 'nameEn'],
        },
    })
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @UseInterceptors(FileInterceptor('img'))
    create(@Body() payload: CreatePlaceCategoryDto, @UploadedFile() img?: Express.Multer.File) {
        return this.service.create(payload, img)
    }

    @Put(':id')
    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: `${UserRole.ADMIN}` })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                nameUz: { type: 'string' },
                nameRu: { type: 'string' },
                nameEn: { type: 'string' },
                img: { type: 'string', format: 'binary' },
            },
        },
    })
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @UseInterceptors(FileInterceptor('img'))
    update(@Param('id', ParseIntPipe) id: number, @Body() payload: UpdatePlaceCategoryDto, @UploadedFile() img?: Express.Multer.File) {
        return this.service.update(id, payload, img)
    }

    @Delete(':id')
    @ApiBearerAuth()
    @ApiOperation({ summary: `${UserRole.ADMIN}` })
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.service.delete(id)
    }
}
