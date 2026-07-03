import { Module } from '@nestjs/common';
import { PlaceCategoryController } from './place-category.controller';
import { PlaceCategoryService } from './place-category.service';

@Module({
  controllers: [PlaceCategoryController],
  providers: [PlaceCategoryService]
})
export class PlaceCategoryModule {}
