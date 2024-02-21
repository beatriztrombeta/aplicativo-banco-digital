/*
  Warnings:

  - A unique constraint covering the columns `[numero_conta]` on the table `Conta` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `descricao` to the `Transferencia` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transferencia" ADD COLUMN     "descricao" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Conta_numero_conta_key" ON "Conta"("numero_conta");
