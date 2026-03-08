import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { IzvestajService } from '../izvestaj/izvestaj.service';

@Controller()
export class RezervacijaConsumer {
  constructor(private izvestajService: IzvestajService) {}

  @MessagePattern('KREIRANA')
  async handleKreirana(@Payload() data: {
    rezervacijaId: number;
    email: string;
    sifra: string;
    usluge: { kategorijaId: number; naziv: string; terminVreme: string }[];
  }) {
    await this.izvestajService.handleKreirana(data);
  }

  @MessagePattern('IZMENJENA')
  async handleIzmenjena(@Payload() data: { rezervacijaId: number }) {
  }

  @MessagePattern('OTKAZANA')
  async handleOtkazana(@Payload() data: { rezervacijaId: number }) {
  }
}