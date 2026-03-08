-- CreateTable
CREATE TABLE "KategorijaStatistika" (
    "id" SERIAL NOT NULL,
    "naziv" TEXT NOT NULL,
    "brojTermina" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "KategorijaStatistika_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RezervacijaStatistika" (
    "id" SERIAL NOT NULL,
    "datum" TIMESTAMP(3) NOT NULL,
    "broj" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "RezervacijaStatistika_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "KategorijaStatistika_naziv_key" ON "KategorijaStatistika"("naziv");

-- CreateIndex
CREATE UNIQUE INDEX "RezervacijaStatistika_datum_key" ON "RezervacijaStatistika"("datum");
