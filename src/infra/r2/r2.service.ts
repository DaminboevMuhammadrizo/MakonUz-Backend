import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { extname } from 'path';

@Injectable()
export class R2Service {
    private readonly client: S3Client
    private readonly bucket: string
    private readonly publicUrl: string

    constructor(private readonly config: ConfigService) {
        this.bucket = this.config.get<string>('R2_BUCKET_NAME')!
        this.publicUrl = this.config.get<string>('R2_PUBLIC_URL')!
        this.client = new S3Client({
            region: 'auto',
            endpoint: this.config.get<string>('R2_ENDPOINT')!,
            credentials: {
                accessKeyId: this.config.get<string>('R2_ACCESS_KEY_ID')!,
                secretAccessKey: this.config.get<string>('R2_SECRET_ACCESS_KEY')!,
            },
        })
    }

    async upload(file: Express.Multer.File) {
        const key = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`
        await this.client.send(new PutObjectCommand({
            Bucket: this.bucket,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
        }))
        return `${this.publicUrl}/${key}`
    }

    async delete(url: string) {
        const key = url.replace(`${this.publicUrl}/`, '')
        await this.client.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: key }))
    }
}
