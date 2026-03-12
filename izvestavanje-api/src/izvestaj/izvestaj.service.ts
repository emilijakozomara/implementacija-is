import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class IzvestajService {
  constructor(private prisma: PrismaService) {}

  async handleKreirana(data: any) {
    if (!data?.usluge || !Array.isArray(data.usluge)) return;

    for (const usluga of data.usluge) {
      if (!usluga.naziv) continue;
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

  async handleIzmenjena(data: any) {
    if (!data) return;

    if (data.dodataUsluga?.naziv) {
      await this.prisma.kategorijaStatistika.upsert({
        where: { naziv: data.dodataUsluga.naziv },
        update: { brojTermina: { increment: 1 } },
        create: { naziv: data.dodataUsluga.naziv, brojTermina: 1 },
      });
    }

    if (data.uklonjena === true && data.usluga?.naziv) {
      const postojeci = await this.prisma.kategorijaStatistika.findUnique({
        where: { naziv: data.usluga.naziv },
      });

      if (postojeci && postojeci.brojTermina > 0) {
        await this.prisma.kategorijaStatistika.update({
          where: { naziv: data.usluga.naziv },
          data: { brojTermina: { decrement: 1 } },
        });
      }
    }
  }

  async handleOtkazana(data: any) {
    if (!data?.usluge || !Array.isArray(data.usluge)) return;

    for (const usluga of data.usluge) {
      if (!usluga.naziv) continue;

      const postojeci = await this.prisma.kategorijaStatistika.findUnique({
        where: { naziv: usluga.naziv },
      });

      if (postojeci && postojeci.brojTermina > 0) {
        await this.prisma.kategorijaStatistika.update({
          where: { naziv: usluga.naziv },
          data: { brojTermina: { decrement: 1 } },
        });
      }
    }

    const datum = new Date();
    datum.setHours(0, 0, 0, 0);

    await this.prisma.rezervacijaStatistika.upsert({
      where: { datum },
      update: { broj: { decrement: 1 } },
      create: { datum, broj: 0 },
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