import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AppSettingsModule } from './app-settings/app-settings.module';
import { KategorijaModule } from './kategorija/kategorija.module';
import { UslugaModule } from './usluga/usluga.module';
import { RezervacijaModule } from './rezervacija/rezervacija.module';
import { ValutaModule } from './valuta/valuta.module';
import { DrzavaModule } from './drzava/drzava.module';
import { MessagingModule } from './messaging/messaging.module';

@Module({
  imports: [
    PrismaModule,
    AppSettingsModule,
    KategorijaModule,
    UslugaModule,
    RezervacijaModule,
    ValutaModule,
    DrzavaModule,
    MessagingModule,
  ],
})
export class AppModule {}