import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ValutaService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    return this.prisma.valuta.findMany();
  }

  async create(naziv: string, kod: string) {
    return this.prisma.valuta.create({
      data: { naziv, kod },
    });
  }

  async getKurs(izKoda: string, uKod: string): Promise<number> {
    try {
      const response = await fetch(
        `https://api.exchangerate-api.com/v4/latest/${izKoda}`,
      );
      const data = await response.json() as { rates: Record<string, number> };
      const kurs = data.rates[uKod];
      if (!kurs) throw new Error(`Kurs za ${uKod} nije pronađen`);
      return kurs;
    } catch {
      throw new Error('Greška pri dohvatanju kursa valuta');
    }
  }

  async konvertujCenu(cena: number, izKoda: string, uKod: string): Promise<number> {
    if (izKoda === uKod) return cena;
    const kurs = await this.getKurs(izKoda, uKod);
    return cena * kurs;
  }
}