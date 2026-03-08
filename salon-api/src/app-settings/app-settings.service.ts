import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import Redis from 'ioredis';

const CACHE_KEY = 'app-settings';
const CACHE_TTL = 3600; 

@Injectable()
export class AppSettingsService {
  private redis: Redis;

  constructor(private prisma: PrismaService) {
    this.redis = new Redis({ host: 'localhost', port: 6379 });
  }

  async get() {
    const cached = await this.redis.get(CACHE_KEY);
    if (cached) {
      return JSON.parse(cached);
    }

    const settings = await this.prisma.appSettings.findFirst({
      include: {
        dozvoljeneValute: { include: { valuta: true } },
      },
    });

    if (settings) {
      await this.redis.set(CACHE_KEY, JSON.stringify(settings), 'EX', CACHE_TTL);
    }

    return settings;
  }

  async upsert(data: {
    naziv: string;
    lokacija: string;
    opis: string;
    radnoVreme: string;
    popustDatum?: Date;
    valutaIds: number[];
  }) {
    const existing = await this.prisma.appSettings.findFirst();

    let result;

    if (existing) {
      await this.prisma.appSettingsValuta.deleteMany({
        where: { appSettingsId: existing.id },
      });

      result = await this.prisma.appSettings.update({
        where: { id: existing.id },
        data: {
          naziv: data.naziv,
          lokacija: data.lokacija,
          opis: data.opis,
          radnoVreme: data.radnoVreme,
          popustDatum: data.popustDatum,
          dozvoljeneValute: {
            create: data.valutaIds.map((valutaId) => ({ valutaId })),
          },
        },
        include: {
          dozvoljeneValute: { include: { valuta: true } },
        },
      });
    } else {
      result = await this.prisma.appSettings.create({
        data: {
          naziv: data.naziv,
          lokacija: data.lokacija,
          opis: data.opis,
          radnoVreme: data.radnoVreme,
          popustDatum: data.popustDatum,
          dozvoljeneValute: {
            create: data.valutaIds.map((valutaId) => ({ valutaId })),
          },
        },
        include: {
          dozvoljeneValute: { include: { valuta: true } },
        },
      });
    }

    await this.redis.del(CACHE_KEY);

    return result;
  }
}