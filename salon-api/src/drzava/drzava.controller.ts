import { Controller, Get, Post, Body } from '@nestjs/common';
import { DrzavaService } from './drzava.service';

@Controller('drzava')
export class DrzavaController {
  constructor(private readonly drzavaService: DrzavaService) {}

  @Get()
  getAll() {
    return this.drzavaService.getAll();
  }

  @Post()
  create(@Body() body: { naziv: string }) {
    return this.drzavaService.create(body.naziv);
  }
}