import { Module } from '@nestjs/common';
import { ValutaService } from './valuta.service';
import { ValutaController } from './valuta.controller';

@Module({
  controllers: [ValutaController],
  providers: [ValutaService],
  exports: [ValutaService], 
})
export class ValutaModule {}