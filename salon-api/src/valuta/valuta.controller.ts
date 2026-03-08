import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ValutaService } from './valuta.service';

@Controller('valuta')
export class ValutaController {
  constructor(private readonly valutaService: ValutaService) {}

  @Get()
  getAll() {
    return this.valutaService.getAll();
  }

  @Post()
  create(@Body() body: { naziv: string; kod: string }) {
    return this.valutaService.create(body.naziv, body.kod);
  }

  @Get('kurs')
  getKurs(
    @Query('iz') iz: string,
    @Query('u') u: string,
    @Query('cena') cena: string,
  ) {
    return this.valutaService.konvertujCenu(Number(cena), iz, u);
  }
}