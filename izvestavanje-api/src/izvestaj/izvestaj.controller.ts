import { Controller, Get } from '@nestjs/common';
import { IzvestajService } from './izvestaj.service';

@Controller('izvestaj')
export class IzvestajController {
  constructor(private izvestajService: IzvestajService) {}

  @Get('termini-po-kategoriji')
  getTerminiPoKategoriji() {
    return this.izvestajService.getTerminiPoKategoriji();
  }

  @Get('rezervacije-po-datumima')
  getRezervacijePoDatumima() {
    return this.izvestajService.getRezervacijePoDatumima();
  }
}