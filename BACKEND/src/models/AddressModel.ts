import { PrismaClient } from '@prisma/client';
import { ClienteIn } from 'dtos/ClientesDTO';
import { ContaIn } from 'dtos/ContaDTO';
import { EnderecoIn } from 'dtos/EnderecoDTO';
import { Status_c } from 'dtos/ContaDTO';

const prisma = new PrismaClient();

export default class AddressModel {
  findOneByCPF( cpf: string ) {
    // throw new Error("Method not implemented.");
    return prisma.cliente.findUnique({where:{cpf: cpf}})
  }

  getAll = async () => {
    return await prisma.endereco.findMany();
  }

  get = async (cliente_id: number) => {
    return await prisma.endereco.findUnique({
      where: {
        cliente_id
      }
    });
  }

  delete = async (id_endereco: number) => {
    await prisma.endereco.delete({
      where: {
        id_endereco
      }
    })
  }

  update = async (cliente_id: number, Endereco: EnderecoIn) => {
    return await prisma.endereco.update({
      where: {
        cliente_id
      },
      data: {
        ...Endereco
      }
    })
  }

};