import { Module } from '@nestjs/common';
import { RezervacijaConsumer } from './rezervacija.consumer';
import { IzvestajModule } from '../izvestaj/izvestaj.module';
@Module({
  imports: [IzvestajModule],
  controllers: [RezervacijaConsumer],
})
export class ConsumerModule {}