import { Cliente, PrismaClient } from '@prisma/client';
import { ClienteIn } from 'dtos/ClientesDTO';
import { ContaIn } from 'dtos/ContaDTO';
import { EnderecoIn } from 'dtos/EnderecoDTO';
import { Status_c } from 'dtos/ContaDTO';

const prisma = new PrismaClient();

export default class UserModel {
  findOneById= async (id_cliente: number) => {
    return await prisma.cliente.findUnique({
      where: {
        id_cliente
      }
    });
  }

  findOneByIdNotUnique = async (id_cliente : number | undefined) => {
    return await prisma.cliente.findFirst({
      where: {
        id_cliente
      }
    })
  }

  findOneByCPF = async( cpf: string ): Promise<Cliente | null> => {
    return await prisma.cliente.findUnique(
      {
        where:{cpf}
      })
  }

  create = async (Cliente: ClienteIn, Endereco: EnderecoIn, Conta: ContaIn) => {
    const usu = await prisma.cliente.create({
      data: {
        cpf: Cliente.cpf,
        nome: Cliente.nome,
        email: Cliente.email,
        senha: Cliente.senha,
        telefone: Cliente.telefone,
        data_nasc: Cliente.data_nasc,
        tipo: Cliente.tipo,
        endereco: {
          create: {
            cep: Endereco.cep,
            rua: Endereco.rua,
            bairro: Endereco.bairro,
            numero: Endereco.numero,
            cidade: Endereco.cidade,
            estado: Endereco.estado,
            complemento: Endereco.complemento,
          }
        },
        conta_relacao: {
          create: {
            numero_agencia: Conta.numero_agencia,
            numero_conta: Conta.numero_conta,
            saldo: Conta.saldo,
            senha_4d: Conta.senha_4d,
            status_conta: Status_c.ativa

          }
        }
      }
    });
  }

  getAll = async () => {
    return await prisma.cliente.findMany();
  }

  get = async (id_cliente: number) => {
    "cliente_id"
    return await prisma.cliente.findUnique({
      where: {
        id_cliente
      }
    });
  }

  delete = async (id_cliente: number) => {
    return await prisma.cliente.delete({
      where: {
        id_cliente
      }
    })
  }

  update = async (id_cliente: number, Cliente: ClienteIn) => {
    return await prisma.cliente.update({
      where: {
        id_cliente
      },
      data: {
        ...Cliente
      }
    })
  }

  updateSenha = async (id_cliente: number, SenhaConta: string) => {
    return await prisma.cliente.update({
      where: {
        id_cliente: id_cliente
      },
      data: {
        senha: SenhaConta
      }
    })
  }

};