import { PrismaClient } from '@prisma/client';
import { ClienteIn } from 'dtos/ClientesDTO';
import { ContaIn } from 'dtos/ContaDTO';
import { EnderecoIn } from 'dtos/EnderecoDTO';
import { Status_c } from 'dtos/ContaDTO';
import { TransferenciaIn } from 'dtos/TransferenciaDTO';

const prisma = new PrismaClient();

export default class AccountModel {
  findOneById( id_cliente: number ) {
    return prisma.conta.findUnique({where:{cliente_id: id_cliente}})
  }

  create = async (Conta: ContaIn, ) => {
    return await prisma.conta.create({
      data: {
        id_cliente: {
          
        },
        numero_agencia: Conta.numero_agencia,
        numero_conta: Conta.numero_conta,
        saldo: Conta.saldo,
        senha_4d: Conta.senha_4d,
        status_conta: Status_c.ativa,
      }
    });
  }

  getAll = async () => {
    return await prisma.conta.findMany();
  }

  get = async (id_conta: number | undefined) => {
    return await prisma.conta.findUnique({
      where: {
        id_conta
      }
    });
  }

  delete = async (id_conta: number) => {
    return await prisma.conta.delete({
      where: {
        id_conta
      }
    })
  }

  updateConta = async (id_conta: number, Conta: ContaIn) => {
    return await prisma.conta.update({
      where: {
        id_conta
      },
      data: {
        ...Conta
      }
    })
  }

  update = async (id_cliente: number, Senha4d: string) => {
    return await prisma.conta.update({
      where: {
        cliente_id: id_cliente
      },
      data: {
        senha_4d: Senha4d
      }
    })
  }
  getByIdUser = async (id_cliente: number) => {
    return await prisma.conta.findUnique({
      where: {
        cliente_id: id_cliente
      }
    });
  }
  getByIdUserNotUnique = async (id_cliente: number | undefined) => {
    return await prisma.conta.findFirst({
      where: {
        cliente_id: id_cliente
      }
    });
  }
  getByNumberAccount = async (numero_conta: string) => {
    return await prisma.conta.findUnique({
      where: {
        numero_conta: numero_conta
      }
    });
  }
  getByIdAccount = async (id_conta: number) => {
    return await prisma.conta.findUnique({
      where: {
        id_conta: id_conta
      }
    });
  }

};