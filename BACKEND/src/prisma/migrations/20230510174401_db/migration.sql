/*
  Warnings:

  - You are about to drop the column `atualizando_em` on the `Cliente` table. All the data in the column will be lost.
  - You are about to drop the column `craido_em` on the `Endereco` table. All the data in the column will be lost.
  - Added the required column `atualizado_em` to the `Cliente` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cliente" DROP COLUMN "atualizando_em",
ADD COLUMN     "atualizado_em" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Endereco" DROP COLUMN "craido_em",
ADD COLUMN     "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
