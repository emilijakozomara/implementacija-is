import { Module } from '@nestjs/common';
import { KategorijaService } from './kategorija.service';
import { KategorijaController } from './kategorija.controller';

@Module({
  controllers: [KategorijaController],
  providers: [KategorijaService],
})
export class KategorijaModule {}