import { Module } from '@nestjs/common';
import { ValutaService } from './valuta.service';
import { ValutaController } from './valuta.controller';

@Module({
  controllers: [ValutaController],
  providers: [ValutaService],
})
export class ValutaModule {}