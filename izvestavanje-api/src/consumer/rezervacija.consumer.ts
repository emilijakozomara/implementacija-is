import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { IzvestajService } from '../izvestaj/izvestaj.service';

@Controller()
export class RezervacijaConsumer {
  constructor(private izvestajService: IzvestajService) {}

  @MessagePattern('KREIRANA')
  async handleKreirana(@Payload() payload: any) {
    console.log('KREIRANA RAW PAYLOAD:', JSON.stringify(payload));
    await this.izvestajService.handleKreirana(payload);
  }

  @MessagePattern('IZMENJENA')
  async handleIzmenjena(@Payload() payload: any) {
    console.log('IZMENJENA RAW PAYLOAD:', JSON.stringify(payload));
    await this.izvestajService.handleIzmenjena(payload);
  }

  @MessagePattern('OTKAZANA')
  async handleOtkazana(@Payload() payload: any) {
    console.log('OTKAZANA RAW PAYLOAD:', JSON.stringify(payload));
    await this.izvestajService.handleOtkazana(payload);
  }
}