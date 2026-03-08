import { Module } from '@nestjs/common';
import { DrzavaService } from './drzava.service';
import { DrzavaController } from './drzava.controller';

@Module({
  controllers: [DrzavaController],
  providers: [DrzavaService],
})
export class DrzavaModule {}