-- CreateEnum
CREATE TYPE "RezerStatus" AS ENUM ('AKTIVNA', 'OTKAZANA');

-- CreateTable
CREATE TABLE "AppSettings" (
    "id" SERIAL NOT NULL,
    "naziv" TEXT NOT NULL,
    "lokacija" TEXT NOT NULL,
    "opis" TEXT NOT NULL,
    "radnoVreme" TEXT NOT NULL,
    "popustDatum" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Valuta" (
    "id" SERIAL NOT NULL,
    "naziv" TEXT NOT NULL,
    "kod" TEXT NOT NULL,

    CONSTRAINT "Valuta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppSettingsValuta" (
    "appSettingsId" INTEGER NOT NULL,
    "valutaId" INTEGER NOT NULL,

    CONSTRAINT "AppSettingsValuta_pkey" PRIMARY KEY ("appSettingsId","valutaId")
);

-- CreateTable
CREATE TABLE "Drzava" (
    "id" SERIAL NOT NULL,
    "naziv" TEXT NOT NULL,

    CONSTRAINT "Drzava_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KategorijaUsluge" (
    "id" SERIAL NOT NULL,
    "naziv" TEXT NOT NULL,

    CONSTRAINT "KategorijaUsluge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Usluga" (
    "id" SERIAL NOT NULL,
    "naziv" TEXT NOT NULL,
    "opis" TEXT NOT NULL,
    "trajanje" INTEGER NOT NULL,
    "maxKlijenataPoTerminu" INTEGER NOT NULL,
    "vremePocetkaPrvog" TIMESTAMP(3) NOT NULL,
    "vremeZavrsetkaPoslednjeg" TIMESTAMP(3) NOT NULL,
    "cena" DECIMAL(65,30) NOT NULL,
    "kategorijaId" INTEGER NOT NULL,

    CONSTRAINT "Usluga_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rezervacija" (
    "id" SERIAL NOT NULL,
    "ime" TEXT NOT NULL,
    "prezime" TEXT NOT NULL,
    "adresa" TEXT NOT NULL,
    "postanskiBroj" TEXT NOT NULL,
    "mesto" TEXT NOT NULL,
    "drzavaId" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "sifra" TEXT NOT NULL,
    "status" "RezerStatus" NOT NULL DEFAULT 'AKTIVNA',
    "valutaId" INTEGER NOT NULL,
    "korisceniPromoKod" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Rezervacija_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReservationService" (
    "id" SERIAL NOT NULL,
    "rezervacijaId" INTEGER NOT NULL,
    "uslugaId" INTEGER NOT NULL,
    "terminVreme" TIMESTAMP(3) NOT NULL,
    "cena" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "ReservationService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PromoKod" (
    "id" SERIAL NOT NULL,
    "kod" TEXT NOT NULL,
    "rezervacijaId" INTEGER NOT NULL,
    "iskoriscen" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PromoKod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OutboxEvent" (
    "id" SERIAL NOT NULL,
    "eventType" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "rezervacijaId" INTEGER NOT NULL,
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OutboxEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Valuta_kod_key" ON "Valuta"("kod");

-- CreateIndex
CREATE UNIQUE INDEX "Rezervacija_sifra_key" ON "Rezervacija"("sifra");

-- CreateIndex
CREATE UNIQUE INDEX "PromoKod_kod_key" ON "PromoKod"("kod");

-- CreateIndex
CREATE UNIQUE INDEX "PromoKod_rezervacijaId_key" ON "PromoKod"("rezervacijaId");

-- AddForeignKey
ALTER TABLE "AppSettingsValuta" ADD CONSTRAINT "AppSettingsValuta_appSettingsId_fkey" FOREIGN KEY ("appSettingsId") REFERENCES "AppSettings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppSettingsValuta" ADD CONSTRAINT "AppSettingsValuta_valutaId_fkey" FOREIGN KEY ("valutaId") REFERENCES "Valuta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usluga" ADD CONSTRAINT "Usluga_kategorijaId_fkey" FOREIGN KEY ("kategorijaId") REFERENCES "KategorijaUsluge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rezervacija" ADD CONSTRAINT "Rezervacija_drzavaId_fkey" FOREIGN KEY ("drzavaId") REFERENCES "Drzava"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rezervacija" ADD CONSTRAINT "Rezervacija_valutaId_fkey" FOREIGN KEY ("valutaId") REFERENCES "Valuta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReservationService" ADD CONSTRAINT "ReservationService_rezervacijaId_fkey" FOREIGN KEY ("rezervacijaId") REFERENCES "Rezervacija"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReservationService" ADD CONSTRAINT "ReservationService_uslugaId_fkey" FOREIGN KEY ("uslugaId") REFERENCES "Usluga"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromoKod" ADD CONSTRAINT "PromoKod_rezervacijaId_fkey" FOREIGN KEY ("rezervacijaId") REFERENCES "Rezervacija"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OutboxEvent" ADD CONSTRAINT "OutboxEvent_rezervacijaId_fkey" FOREIGN KEY ("rezervacijaId") REFERENCES "Rezervacija"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
