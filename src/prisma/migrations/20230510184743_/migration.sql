-- AlterTable
CREATE SEQUENCE cliente_id_cliente_seq;
ALTER TABLE "Cliente" ALTER COLUMN "id_cliente" SET DEFAULT nextval('cliente_id_cliente_seq');
ALTER SEQUENCE cliente_id_cliente_seq OWNED BY "Cliente"."id_cliente";
