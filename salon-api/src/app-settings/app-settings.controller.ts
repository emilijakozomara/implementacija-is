import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppSettingsService } from './app-settings.service';

@Controller('app-settings')
export class AppSettingsController {
  constructor(private readonly appSettingsService: AppSettingsService) {}

  @Get()
  get() {
    return this.appSettingsService.get();
  }

  @Post()
  upsert(
    @Body()
    body: {
      naziv: string;
      lokacija: string;
      opis: string;
      radnoVreme: string;
      popustDatum?: string;
      valutaIds: number[];
    },
  ) {
    return this.appSettingsService.upsert({
      ...body,
      popustDatum: body.popustDatum ? new Date(body.popustDatum) : undefined,
    });
  }
}