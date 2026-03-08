import { Module } from '@nestjs/common';
import { AppSettingsService } from './app-settings.service';
import { AppSettingsController } from './app-settings.controller';

@Module({
  controllers: [AppSettingsController],
  providers: [AppSettingsService],
})
export class AppSettingsModule {}