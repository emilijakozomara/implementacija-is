/*
  Warnings:

  - You are about to drop the `OutboxEvent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "OutboxEvent" DROP CONSTRAINT "OutboxEvent_rezervacijaId_fkey";

-- DropTable
DROP TABLE "OutboxEvent";
