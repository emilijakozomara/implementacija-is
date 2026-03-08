import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UslugaService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    return this.prisma.usluga.findMany({
      include: { kategorija: true },
    });
  }

  async getById(id: number) {
    return this.prisma.usluga.findUnique({
      where: { id },
      include: { kategorija: true },
    });
  }

  async create(data: {
    naziv: string;
    opis: string;
    trajanje: number;
    maxKlijenataPoTerminu: number;
    vremePocetkaPrvog: Date;
    vremeZavrsetkaPoslednjeg: Date;
    cena: number;
    kategorijaId: number;
  }) {
    return this.prisma.usluga.create({ data });
  }

  async update(id: number, data: {
    naziv?: string;
    opis?: string;
    trajanje?: number;
    maxKlijenataPoTerminu?: number;
    vremePocetkaPrvog?: Date;
    vremeZavrsetkaPoslednjeg?: Date;
    cena?: number;
    kategorijaId?: number;
  }) {
    return this.prisma.usluga.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return this.prisma.usluga.delete({
      where: { id },
    });
  }

  async getSlobodniTermini(uslugaId: number, datum: Date) {
    const usluga = await this.prisma.usluga.findUnique({
      where: { id: uslugaId },
    });

    if (!usluga) throw new Error('Usluga nije pronađena');

    const termini: Date[] = [];
    const pocetak = new Date(datum);
    pocetak.setHours(
      usluga.vremePocetkaPrvog.getHours(),
      usluga.vremePocetkaPrvog.getMinutes(),
      0, 0
    );

    const kraj = new Date(datum);
    kraj.setHours(
      usluga.vremeZavrsetkaPoslednjeg.getHours(),
      usluga.vremeZavrsetkaPoslednjeg.getMinutes(),
      0, 0
    );

    const trenutni = new Date(pocetak);
    while (trenutni <= kraj) {
      const count = await this.prisma.reservationService.count({
        where: {
          uslugaId,
          terminVreme: new Date(trenutni),
          rezervacija: { status: 'AKTIVNA' },
        },
      });

      if (count < usluga.maxKlijenataPoTerminu) {
        termini.push(new Date(trenutni));
      }

      trenutni.setMinutes(trenutni.getMinutes() + usluga.trajanje);
    }

    return termini;
  }
}