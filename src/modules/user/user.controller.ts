import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { UserRole } from '@prisma/client';
import { GetAllManageDto } from './dto/get.all.manager.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CreateManagerDto } from './dto/create.dto';
import { UpdateManagerDto } from './dto/update.dto';

@Controller('user')
export class UserController {
    constructor(private readonly service: UserService) { }

    @Get('all/managers')
    @ApiBearerAuth()
    @ApiOperation({ summary: `${UserRole.ADMIN}` })
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    getAll(@Query() query: GetAllManageDto) {
        return this.service.getAll(query)
    }

    @Post()
    @ApiBearerAuth()
    @ApiOperation({ summary: `${UserRole.ADMIN}` })
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    crate(@Body() payload: CreateManagerDto) {
        return this.service.create(payload)
    }

    @Put(':id')
    @ApiBearerAuth()
    @ApiOperation({ summary: `${UserRole.ADMIN}` })
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    update(@Param('id', ParseIntPipe) id: number, @Body() payload: UpdateManagerDto) {
        return this.service.update(id, payload)
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
