import { Module } from '@nestjs/common';
import { IzvestajService } from './izvestaj.service';
import { IzvestajController } from './izvestaj.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [IzvestajController],
  providers: [IzvestajService],
  exports: [IzvestajService],
})
export class IzvestajModule {}