import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DrzavaService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    return this.prisma.drzava.findMany();
  }

  async create(naziv: string) {
    return this.prisma.drzava.create({
      data: { naziv },
    });
  }
}