import { PrismaClient } from '@prisma/client';
import { Status_t, TransferenciaIn } from 'dtos/TransferenciaDTO';

const prisma = new PrismaClient();

export default class UserModel {

  findOneByCPF(cpf: string) {
    return prisma.cliente.findUnique({ where: { cpf: cpf } })
  }

  create = async (Transferencia: TransferenciaIn) => {
    return await prisma.transferencia.create({
      data: {
        id_origem: Transferencia.id_origem,
        id_destino: Transferencia.id_destino,
        valor: Transferencia.valor,
        status_transferencia: Status_t.enviada,
        descricao: Transferencia.descricao,
        data_transferencia: Transferencia.data_transferencia,
      }
    });
  }

  getAll = async () => {
    return await prisma.transferencia.findMany();
  }

  get = async (id_transferencia: number) => {
    return await prisma.transferencia.findUnique({
      where: {
        id_transferencia
      }
    });
  }

  delete = async (id_transferencia: number) => {
    return await prisma.transferencia.delete({
      where: {
        id_transferencia
      }
    })
  }

  update = async (id_transferencia: number, Transferencia: TransferenciaIn) => {
    return await prisma.transferencia.update({
      where: {
        id_transferencia
      },
      data: {
        ...Transferencia
      }
    })
  }
  getTodas = async (id_conta: number, inicio: any, fim: any, page: number, order: 'desc' | 'asc') => {
    try {
      // console.log("todas",id_conta, inicio, fim, page, order)
      const pageSize = 10;
      const offset = (page - 1) * pageSize;

      const transferenciasTotais = await prisma.transferencia.count({
        where: {
          OR: [
            {
              id_origem: id_conta,
            },
            {
              id_destino: id_conta,
            }
          ],
          data_transferencia: {
            gte: inicio,
            lte: fim,
          },
        }
      });

      const transferencias = await prisma.transferencia.findMany({
        where: {
          OR: [
            {
              id_origem: id_conta,
            },
            {
              id_destino: id_conta,
            }
          ],
          data_transferencia: {
            gte: inicio,
            lte: fim,
          },
        },
        orderBy: {
          data_transferencia: order,
        },
        skip: offset,
        take: pageSize,
      });
      const qtdePag = Math.ceil(transferenciasTotais / pageSize)
      return {
        paginacao: {
          page: page,
          totalPag: qtdePag,
        },
        transferencias
      };
    }
    catch (error) {
      throw new Error('Erro ao buscar transferências paginadas. erro:');
    } finally {
      await prisma.$disconnect();
    }
  }
  getEntradas = async (id_conta: number, inicio: any, fim: any, page: number, order: 'desc' | 'asc') => {
    try {
      // console.log("entrada",id_conta, inicio, fim, page, order)
      const pageSize = 10;
      const offset = (page - 1) * pageSize;

      const transferenciasTotais = await prisma.transferencia.count({
        where: {
          id_destino: id_conta,
          data_transferencia: {
            gte: inicio,
            lte: fim,
          },
        },
      });

      const transferencias = await prisma.transferencia.findMany({
        where: {
          id_destino: id_conta,
          data_transferencia: {
            gte: inicio,
            lte: fim,
          },
        },
        orderBy: {
          data_transferencia: order,
        },
        skip: offset,
        take: pageSize,
      });
      const qtdePag = Math.ceil(transferenciasTotais / pageSize)
      return {
        paginacao: {
          page: page,
          totalPag: qtdePag,
        },
        transferencias
      };
    }
    catch (error) {
      throw new Error('Erro ao buscar transferências paginadas.');
    } finally {
      await prisma.$disconnect();
    }
  }

  getSaidas = async (id_conta: number, inicio: any, fim: any, page: number, order: 'desc' | 'asc') => {
    try {
      // console.log("saida", id_conta, inicio, fim, page, order)
      const pageSize = 10;
      const offset = (page - 1) * pageSize;

      const transferenciasTotais = await prisma.transferencia.count({
        where: {
          id_origem: id_conta,
          data_transferencia: {
            gte: inicio,
            lte: fim,
          },
        },
      });


      const transferencias = await prisma.transferencia.findMany({
        where: {
          id_origem: id_conta,
          data_transferencia: {
            gte: inicio,
            lte: fim,
          },
        },
        orderBy: {
          data_transferencia: order,
        },
        skip: offset,
        take: pageSize,
      });
      const qtdePag = Math.ceil(transferenciasTotais / pageSize)
      return {
        paginacao: {
          page: page,
          totalPag: qtdePag,
        },
        transferencias
      };
    }
    catch (error) {
      throw new Error('Erro ao buscar transferências paginadas.');
    } finally {
      await prisma.$disconnect();
    }
  }
}