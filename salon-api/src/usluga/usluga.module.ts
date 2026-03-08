import { Module } from '@nestjs/common';
import { UslugaService } from './usluga.service';
import { UslugaController } from './usluga.controller';

@Module({
  controllers: [UslugaController],
  providers: [UslugaService],
})
export class UslugaModule {}