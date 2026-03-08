import { Controller, Get, Post, Put, Delete, Body, Query, Param, ParseIntPipe } from '@nestjs/common';
import { RezervacijaService } from './rezervacija.service';

@Controller('rezervacija')
export class RezervacijaController {
  constructor(private readonly rezervacijaService: RezervacijaService) {}

  @Post()
  create(@Body() body: {
    ime: string;
    prezime: string;
    adresa: string;
    postanskiBroj: string;
    mesto: string;
    drzavaId: number;
    email: string;
    valutaId: number;
    korisceniPromoKod?: string;
    usluge: { uslugaId: number; terminVreme: string }[];
  }) {
    return this.rezervacijaService.create(body);
  }

  @Get()
  get(
    @Query('email') email: string,
    @Query('sifra') sifra: string,
  ) {
    return this.rezervacijaService.get(email, sifra);
  }

  @Put('dodaj-uslugu')
  dodajUslugu(@Body() body: {
    email: string;
    sifra: string;
    uslugaId: number;
    terminVreme: string;
  }) {
    return this.rezervacijaService.dodajUslugu(
      body.email,
      body.sifra,
      body.uslugaId,
      body.terminVreme,
    );
  }

  @Delete('ukloni-uslugu/:id')
  ukloniUslugu(
    @Param('id', ParseIntPipe) id: number,
    @Query('email') email: string,
    @Query('sifra') sifra: string,
  ) {
    return this.rezervacijaService.ukloniUslugu(email, sifra, id);
  }

  @Post('otkazi')
  otkazi(@Body() body: { email: string; sifra: string }) {
    return this.rezervacijaService.otkazi(body.email, body.sifra);
  }
}