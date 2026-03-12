import { Module } from '@nestjs/common';
import { RezervacijaService } from './rezervacija.service';
import { RezervacijaController } from './rezervacija.controller';
import { MessagingModule } from '../messaging/messaging.module';
import { ValutaModule } from '../valuta/valuta.module';

@Module({
  imports: [MessagingModule, ValutaModule], 
  controllers: [RezervacijaController],
  providers: [RezervacijaService],
})
export class RezervacijaModule {}