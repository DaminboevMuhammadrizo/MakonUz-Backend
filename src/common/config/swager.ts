import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import basicAuth from 'express-basic-auth';

export class SwaggerManager {
    static setup(app: INestApplication) {
        const configService = app.get(ConfigService);

        const swaggerUsername = configService.get<string>('SWAGGER_USERNAME') || 'makon';
        const swaggerPassword = configService.get<string>('SWAGGER_PASSWORD') || 'admin';

        app.use(
            '/api/docs',
            basicAuth({
                challenge: true,
                users: { [swaggerUsername]: swaggerPassword },
            }),
        );

        const config = new DocumentBuilder()
            .setTitle('MakonUz API')
            .setDescription('MakonUZ backend API')
            .setVersion('1.0')
            .addBearerAuth()
            .build();

        const document = SwaggerModule.createDocument(app, config);
        SwaggerModule.setup('api/docs', app, document, {
            swaggerOptions: { filter: true, persistAuthorization: true },
        });
    }
}
