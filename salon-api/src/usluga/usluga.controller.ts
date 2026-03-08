import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, Query } from '@nestjs/common';
import { UslugaService } from './usluga.service';

@Controller('usluga')
export class UslugaController {
  constructor(private readonly uslugaService: UslugaService) {}

  @Get()
  getAll() {
    return this.uslugaService.getAll();
  }

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.uslugaService.getById(id);
  }

  @Get(':id/termini')
  getSlobodniTermini(
    @Param('id', ParseIntPipe) id: number,
    @Query('datum') datum: string,
  ) {
    return this.uslugaService.getSlobodniTermini(id, new Date(datum));
  }

  @Post()
  create(@Body() body: {
    naziv: string;
    opis: string;
    trajanje: number;
    maxKlijenataPoTerminu: number;
    vremePocetkaPrvog: string;
    vremeZavrsetkaPoslednjeg: string;
    cena: number;
    kategorijaId: number;
  }) {
    return this.uslugaService.create({
      ...body,
      vremePocetkaPrvog: new Date(body.vremePocetkaPrvog),
      vremeZavrsetkaPoslednjeg: new Date(body.vremeZavrsetkaPoslednjeg),
    });
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: {
      naziv?: string;
      opis?: string;
      trajanje?: number;
      maxKlijenataPoTerminu?: number;
      vremePocetkaPrvog?: string;
      vremeZavrsetkaPoslednjeg?: string;
      cena?: number;
      kategorijaId?: number;
    },
  ) {
    return this.uslugaService.update(id, {
      ...body,
      vremePocetkaPrvog: body.vremePocetkaPrvog ? new Date(body.vremePocetkaPrvog) : undefined,
      vremeZavrsetkaPoslednjeg: body.vremeZavrsetkaPoslednjeg ? new Date(body.vremeZavrsetkaPoslednjeg) : undefined,
    });
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.uslugaService.delete(id);
  }
}