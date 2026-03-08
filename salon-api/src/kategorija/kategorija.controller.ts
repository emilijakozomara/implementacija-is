import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { KategorijaService } from './kategorija.service';

@Controller('kategorija')
export class KategorijaController {
  constructor(private readonly kategorijaService: KategorijaService) {}

  @Get()
  getAll() {
    return this.kategorijaService.getAll();
  }

  @Post()
  create(@Body() body: { naziv: string }) {
    return this.kategorijaService.create(body.naziv);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: { naziv: string }) {
    return this.kategorijaService.update(id, body.naziv);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.kategorijaService.delete(id);
  }
}