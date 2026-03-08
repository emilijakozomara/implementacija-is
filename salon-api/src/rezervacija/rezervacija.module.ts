import { Module } from '@nestjs/common';
import { RezervacijaService } from './rezervacija.service';
import { RezervacijaController } from './rezervacija.controller';
import { MessagingModule } from '../messaging/messaging.module';

@Module({
  imports: [MessagingModule],
  controllers: [RezervacijaController],
  providers: [RezervacijaService],
})
export class RezervacijaModule {}