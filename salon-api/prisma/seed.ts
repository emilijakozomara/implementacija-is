import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const rsd = await prisma.valuta.create({
    data: { naziv: 'Srpski dinar', kod: 'RSD' },
  });
  const eur = await prisma.valuta.create({
    data: { naziv: 'Euro', kod: 'EUR' },
  });
  const usd = await prisma.valuta.create({
    data: { naziv: 'Američki dolar', kod: 'USD' },
  });

  await prisma.appSettings.create({
    data: {
      naziv: 'Salon Trač',
      lokacija: 'Beograd, Srbija',
      opis: 'Vaš salon lepote za sve prilike. Opustite se i uživajte u našim tretmanima.',
      radnoVreme: 'Pon-Pet 09:00-20:00, Sub 09:00-15:00',
      popustDatum: new Date('2025-12-31'),
      dozvoljeneValute: {
        create: [
          { valutaId: rsd.id },
          { valutaId: eur.id },
          { valutaId: usd.id },
        ],
      },
    },
  });

  const masaze = await prisma.kategorijaUsluge.create({
    data: { naziv: 'Masaže' },
  });
  const tretmani = await prisma.kategorijaUsluge.create({
    data: { naziv: 'Tretmani lica' },
  });
  const nokti = await prisma.kategorijaUsluge.create({
    data: { naziv: 'Nokti' },
  });

  await prisma.usluga.createMany({
    data: [
      {
        naziv: 'Relax masaža',
        opis: 'Opuštajuća masaža celog tela.',
        trajanje: 60,
        maxKlijenataPoTerminu: 2,
        vremePocetkaPrvog: new Date('2024-01-01T09:00:00'),
        vremeZavrsetkaPoslednjeg: new Date('2024-01-01T20:00:00'),
        cena: 3500,
        kategorijaId: masaze.id,
      },
      {
        naziv: 'Sportska masaža',
        opis: 'Masaža za oporavak mišića.',
        trajanje: 45,
        maxKlijenataPoTerminu: 1,
        vremePocetkaPrvog: new Date('2024-01-01T09:00:00'),
        vremeZavrsetkaPoslednjeg: new Date('2024-01-01T20:00:00'),
        cena: 2800,
        kategorijaId: masaze.id,
      },
      {
        naziv: 'Hidratantni tretman',
        opis: 'Dubinska hidratacija kože lica.',
        trajanje: 50,
        maxKlijenataPoTerminu: 1,
        vremePocetkaPrvog: new Date('2024-01-01T09:00:00'),
        vremeZavrsetkaPoslednjeg: new Date('2024-01-01T18:00:00'),
        cena: 2500,
        kategorijaId: tretmani.id,
      },
      {
        naziv: 'Anti-age tretman',
        opis: 'Tretman protiv starenja kože.',
        trajanje: 60,
        maxKlijenataPoTerminu: 1,
        vremePocetkaPrvog: new Date('2024-01-01T09:00:00'),
        vremeZavrsetkaPoslednjeg: new Date('2024-01-01T18:00:00'),
        cena: 4000,
        kategorijaId: tretmani.id,
      },
      {
        naziv: 'Manikir',
        opis: 'Uređivanje i lakiranje noktiju.',
        trajanje: 45,
        maxKlijenataPoTerminu: 3,
        vremePocetkaPrvog: new Date('2024-01-01T09:00:00'),
        vremeZavrsetkaPoslednjeg: new Date('2024-01-01T20:00:00'),
        cena: 1500,
        kategorijaId: nokti.id,
      },
      {
        naziv: 'Gel nokti',
        opis: 'Postavljanje i oblikovanje gel noktiju.',
        trajanje: 90,
        maxKlijenataPoTerminu: 2,
        vremePocetkaPrvog: new Date('2024-01-01T09:00:00'),
        vremeZavrsetkaPoslednjeg: new Date('2024-01-01T20:00:00'),
        cena: 2500,
        kategorijaId: nokti.id,
      },
    ],
  });

  await prisma.drzava.createMany({
    data: [
      { naziv: 'Srbija' },
      { naziv: 'Bosna i Hercegovina' },
      { naziv: 'Hrvatska' },
      { naziv: 'Crna Gora' },
      { naziv: 'Slovenija' },
    ],
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());