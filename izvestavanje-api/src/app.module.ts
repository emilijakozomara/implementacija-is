import { Module } from '@nestjs/common';
import { ConsumerModule } from './consumer/consumer.module';
import { IzvestajModule } from './izvestaj/izvestaj.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    IzvestajModule,
    ConsumerModule,
  ],
})
export class AppModule {}