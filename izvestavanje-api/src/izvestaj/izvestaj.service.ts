import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class IzvestajService {
  constructor(private prisma: PrismaService) {}

  async handleKreirana(data: {
    rezervacijaId: number;
    usluge: { kategorijaId: number; naziv: string; terminVreme: string }[];
  }) {
    for (const usluga of data.usluge) {
      await this.prisma.kategorijaStatistika.upsert({
        where: { naziv: usluga.naziv },
        update: { brojTermina: { increment: 1 } },
        create: { naziv: usluga.naziv, brojTermina: 1 },
      });
    }

    const datum = new Date();
    datum.setHours(0, 0, 0, 0);

    await this.prisma.rezervacijaStatistika.upsert({
      where: { datum },
      update: { broj: { increment: 1 } },
      create: { datum, broj: 1 },
    });
  }

  async getTerminiPoKategoriji() {
    return this.prisma.kategorijaStatistika.findMany({
      orderBy: { brojTermina: 'desc' },
    });
  }

  async getRezervacijePoDatumima() {
    return this.prisma.rezervacijaStatistika.findMany({
      orderBy: { datum: 'asc' },
    });
  }
}