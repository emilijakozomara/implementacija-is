import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { IzvestajService } from '../izvestaj/izvestaj.service';

@Controller()
export class RezervacijaConsumer {
  constructor(private izvestajService: IzvestajService) {}

  @MessagePattern('KREIRANA')
  async handleKreirana(@Payload() payload: any) {
    await this.izvestajService.handleKreirana(payload);
  }

  @MessagePattern('IZMENJENA')
  async handleIzmenjena(@Payload() payload: any) {
    await this.izvestajService.handleIzmenjena(payload);
  }

  @MessagePattern('OTKAZANA')
  async handleOtkazana(@Payload() payload: any) {
    await this.izvestajService.handleOtkazana(payload);
  }
}