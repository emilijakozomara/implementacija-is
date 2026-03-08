import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class KategorijaService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    return this.prisma.kategorijaUsluge.findMany({
      include: { usluge: true },
    });
  }

  async create(naziv: string) {
    return this.prisma.kategorijaUsluge.create({
      data: { naziv },
    });
  }

  async update(id: number, naziv: string) {
    return this.prisma.kategorijaUsluge.update({
      where: { id },
      data: { naziv },
    });
  }

  async delete(id: number) {
    return this.prisma.kategorijaUsluge.delete({
      where: { id },
    });
  }
}