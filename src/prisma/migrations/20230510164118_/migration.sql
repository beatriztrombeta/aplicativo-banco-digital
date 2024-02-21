-- CreateEnum
CREATE TYPE "Status_c" AS ENUM ('ativa', 'inativa', 'bloqueada');

-- CreateEnum
CREATE TYPE "Status_t" AS ENUM ('enviada', 'rejeitada');

-- CreateTable
CREATE TABLE "Cliente" (
    "id_cliente" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "data_nasc" TIMESTAMP(3) NOT NULL,
    "senha" TEXT NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizando_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id_cliente")
);

-- CreateTable
CREATE TABLE "Endereco" (
    "id_endereco" SERIAL NOT NULL,
    "cliente_id" INTEGER NOT NULL,
    "cep" TEXT NOT NULL,
    "rua" TEXT NOT NULL,
    "bairro" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "complemento" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "craido_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Endereco_pkey" PRIMARY KEY ("id_endereco")
);

-- CreateTable
CREATE TABLE "Conta" (
    "id_conta" SERIAL NOT NULL,
    "cliente_id" INTEGER NOT NULL,
    "numero_agencia" TEXT NOT NULL,
    "numero_conta" TEXT NOT NULL,
    "saldo" DOUBLE PRECISION NOT NULL,
    "status_conta" "Status_c" NOT NULL,
    "senha_4d" TEXT NOT NULL,

    CONSTRAINT "Conta_pkey" PRIMARY KEY ("id_conta")
);

-- CreateTable
CREATE TABLE "Transferencia" (
    "id_transferencia" SERIAL NOT NULL,
    "id_origem" INTEGER NOT NULL,
    "id_destino" INTEGER NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "status_transferencia" "Status_t" NOT NULL,
    "data_transferencia" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transferencia_pkey" PRIMARY KEY ("id_transferencia")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_email_key" ON "Cliente"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_cpf_key" ON "Cliente"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Endereco_cliente_id_key" ON "Endereco"("cliente_id");

-- CreateIndex
CREATE UNIQUE INDEX "Conta_cliente_id_key" ON "Conta"("cliente_id");

-- AddForeignKey
ALTER TABLE "Endereco" ADD CONSTRAINT "Endereco_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "Cliente"("id_cliente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conta" ADD CONSTRAINT "Conta_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "Cliente"("id_cliente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transferencia" ADD CONSTRAINT "Transferencia_id_origem_fkey" FOREIGN KEY ("id_origem") REFERENCES "Conta"("id_conta") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transferencia" ADD CONSTRAINT "Transferencia_id_destino_fkey" FOREIGN KEY ("id_destino") REFERENCES "Conta"("id_conta") ON DELETE RESTRICT ON UPDATE CASCADE;
