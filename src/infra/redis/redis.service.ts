import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
    private readonly client: Redis

    constructor(config: ConfigService) {
        this.client = new Redis(config.get<string>('REDIS_URL')!)
    }

    async getOrSet<T>(key: string, indexKey: string, ttlSeconds: number, fetcher: () => Promise<T>): Promise<T> {
        const cached = await this.client.get(key)
        if (cached) return JSON.parse(cached)

        const data = await fetcher()
        await this.client.set(key, JSON.stringify(data), 'EX', ttlSeconds)
        await this.client.sadd(indexKey, key)
        return data
    }

    async invalidate(indexKey: string) {
        const keys = await this.client.smembers(indexKey)
        if (keys.length) await this.client.del(...keys)
        await this.client.del(indexKey)
    }

    onModuleDestroy() {
        this.client.disconnect()
    }
}
