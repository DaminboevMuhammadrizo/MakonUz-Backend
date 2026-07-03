import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/Database/prisma.service';
import { GetAllManageDto } from './dto/get.all.manager.dto';
import { CreateManagerDto } from './dto/create.dto';
import { UpdateManagerDto } from './dto/update.dto';
import { UserRole } from '@prisma/client';
import { hashPassword } from 'src/common/config/bcrypt';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) { }

    async getAll(query: GetAllManageDto) {
        return await this.prisma.user.findMany({
            where: {
                role: UserRole.MANAGER,
                OR: query.search ? [
                    { fullname: { contains: query.search, mode: 'insensitive' } },
                    { phone: { contains: query.search, mode: 'insensitive' } }
                ] : undefined
            },
            skip: ((query.page || 1) - 1) * (query.limit || 10),
            take: query.limit || 10,
        })
    }

    async create(payload: CreateManagerDto) {
        payload.pass = await hashPassword(payload.pass)
        return await this.prisma.user.create({
            data: { ...payload, role: UserRole.MANAGER }
        })
    }

    async update(id: number, payload: UpdateManagerDto) {
        if (payload.pass) payload.pass = await hashPassword(payload.pass)
        return await this.prisma.user.update({ where: { id }, data: payload })
    }

    async delete(id: number) {
        return await this.prisma.user.delete({ where: { id } })
    }
}
