import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MessagingService } from '../messaging/messaging.service';

function generateSifra(): string {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

function generatePromoKod(): string {
  return 'PROMO-' + Math.random().toString(36).substring(2, 8).toUpperCase();
}

type UslugaZaKreiranje = {
  uslugaId: number;
  terminVreme: Date;
  cena: number;
};

@Injectable()
export class RezervacijaService {
  constructor(
    private prisma: PrismaService,
    private messaging: MessagingService,
  ) {}

  async create(data: {
    ime: string;
    prezime: string;
    adresa: string;
    postanskiBroj: string;
    mesto: string;
    drzavaId: number;
    email: string;
    valutaId: number;
    korisceniPromoKod?: string;
    usluge: { uslugaId: number; terminVreme: string }[];
  }) {
    let promoKodPopust = 0;
    if (data.korisceniPromoKod) {
      const promo = await this.prisma.promoKod.findUnique({
        where: { kod: data.korisceniPromoKod },
      });
      if (!promo || promo.iskoriscen) {
        throw new BadRequestException('Promo kod nije validan ili je već iskorišćen');
      }
      promoKodPopust = 5;
      await this.prisma.promoKod.update({
        where: { kod: data.korisceniPromoKod },
        data: { iskoriscen: true },
      });
    }

    const settings = await this.prisma.appSettings.findFirst();
    const now = new Date();
    const ima10Popust = settings?.popustDatum
      ? now <= settings.popustDatum
      : false;

    const uslugeZaKreiranje: UslugaZaKreiranje[] = [];
    for (const u of data.usluge) {
      const usluga = await this.prisma.usluga.findUnique({
        where: { id: u.uslugaId },
      });
      if (!usluga) throw new NotFoundException(`Usluga ${u.uslugaId} nije pronađena`);

      const terminVreme = new Date(u.terminVreme);

      const count = await this.prisma.reservationService.count({
        where: {
          uslugaId: u.uslugaId,
          terminVreme,
          rezervacija: { status: 'AKTIVNA' },
        },
      });
      if (count >= usluga.maxKlijenataPoTerminu) {
        throw new BadRequestException(`Termin za uslugu ${usluga.naziv} je popunjen`);
      }

      let cena = Number(usluga.cena);
      if (ima10Popust) cena = cena * 0.9;
      if (promoKodPopust > 0) cena = cena * (1 - promoKodPopust / 100);

      uslugeZaKreiranje.push({ uslugaId: u.uslugaId, terminVreme, cena });
    }

    const sifra = generateSifra();
    const noviPromoKod = generatePromoKod();

    const rezervacija = await this.prisma.rezervacija.create({
      data: {
        ime: data.ime,
        prezime: data.prezime,
        adresa: data.adresa,
        postanskiBroj: data.postanskiBroj,
        mesto: data.mesto,
        drzavaId: data.drzavaId,
        email: data.email,
        sifra,
        valutaId: data.valutaId,
        korisceniPromoKod: data.korisceniPromoKod,
        usluge: { create: uslugeZaKreiranje },
        promoKod: { create: { kod: noviPromoKod } },
      },
      include: {
        usluge: { include: { usluga: { include: { kategorija: true } } } },
        promoKod: true,
        valuta: true,
        drzava: true,
      },
    });

    this.messaging.publishRezervacijaEvent('KREIRANA', {
      email: data.email,
      sifra,
      rezervacijaId: rezervacija.id,
      usluge: rezervacija.usluge.map((u) => ({
        kategorijaId: u.usluga.kategorijaId,
        naziv: u.usluga.kategorija?.naziv ?? '',
        terminVreme: u.terminVreme.toISOString(),
      })),
    });

    return rezervacija;
  }

  async get(email: string, sifra: string) {
    const rezervacija = await this.prisma.rezervacija.findFirst({
      where: { email, sifra },
      include: {
        usluge: { include: { usluga: { include: { kategorija: true } } } },
        promoKod: true,
        valuta: true,
        drzava: true,
      },
    });
    if (!rezervacija) throw new NotFoundException('Rezervacija nije pronađena');
    return rezervacija;
  }

  async dodajUslugu(
    email: string,
    sifra: string,
    uslugaId: number,
    terminVreme: string,
  ) {
    const rezervacija = await this.prisma.rezervacija.findFirst({
      where: { email, sifra, status: 'AKTIVNA' },
    });
    if (!rezervacija) throw new NotFoundException('Rezervacija nije pronađena');

    const usluga = await this.prisma.usluga.findUnique({
      where: { id: uslugaId },
    });
    if (!usluga) throw new NotFoundException('Usluga nije pronađena');

    const terminDate = new Date(terminVreme);

    const count = await this.prisma.reservationService.count({
      where: {
        uslugaId,
        terminVreme: terminDate,
        rezervacija: { status: 'AKTIVNA' },
      },
    });
    if (count >= usluga.maxKlijenataPoTerminu) {
      throw new BadRequestException('Termin je popunjen');
    }

    const settings = await this.prisma.appSettings.findFirst();
    const now = new Date();
    const ima10Popust = settings?.popustDatum
      ? now <= settings.popustDatum
      : false;
    let cena = Number(usluga.cena);
    if (ima10Popust) cena = cena * 0.9;

    await this.prisma.reservationService.create({
      data: {
        rezervacijaId: rezervacija.id,
        uslugaId,
        terminVreme: terminDate,
        cena,
      },
    });

    this.messaging.publishRezervacijaEvent('IZMENJENA', {
      rezervacijaId: rezervacija.id,
    });

    return this.get(email, sifra);
  }

  async ukloniUslugu(
    email: string,
    sifra: string,
    reservationServiceId: number,
  ) {
    const rezervacija = await this.prisma.rezervacija.findFirst({
      where: { email, sifra, status: 'AKTIVNA' },
    });
    if (!rezervacija) throw new NotFoundException('Rezervacija nije pronađena');

    await this.prisma.reservationService.delete({
      where: { id: reservationServiceId },
    });

    this.messaging.publishRezervacijaEvent('IZMENJENA', {
      rezervacijaId: rezervacija.id,
    });

    return this.get(email, sifra);
  }

  async otkazi(email: string, sifra: string) {
    const rezervacija = await this.prisma.rezervacija.findFirst({
      where: { email, sifra, status: 'AKTIVNA' },
    });
    if (!rezervacija) throw new NotFoundException('Rezervacija nije pronađena');

    await this.prisma.promoKod.updateMany({
      where: { rezervacijaId: rezervacija.id },
      data: { iskoriscen: true },
    });

    await this.prisma.rezervacija.update({
      where: { id: rezervacija.id },
      data: { status: 'OTKAZANA' },
    });

    this.messaging.publishRezervacijaEvent('OTKAZANA', {
      rezervacijaId: rezervacija.id,
      email,
    });

    return { message: 'Rezervacija je otkazana' };
  }
}