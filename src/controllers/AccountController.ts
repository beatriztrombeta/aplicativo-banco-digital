import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client';
import UserModel from "models/UserModel";
import AccountModel from "models/AccountModel";
import { ContaIn, ContaOut } from "dtos/ContaDTO";
import { ClienteIn, ClienteOut } from "dtos/ClientesDTO";
import formatacaoOutput from "util/formatacao";
import AddressModel from "models/AddressModel";
import bcrypt, { compare } from 'bcrypt';

const accountModel = new AccountModel();
const userModel = new UserModel();
const addressModel = new AddressModel();

export default class AccountController {

  getSaldo = async (req: Request, res: Response) => {
    try {
      const id: number = parseInt(req.params.id);
      const id_cliente: number = parseInt(req.params.id);
      const conta_cliente = await accountModel.getByIdUser(id_cliente)
      const saldo = conta_cliente?.saldo;

      if (saldo !== undefined) {
        res.status(200).json({
          id: conta_cliente?.cliente_id,
          saldo: saldo,
        });
      } else {
        res.status(404).json({
          error: "USR-06",
          message: "User not found.",
        });
      }
    } catch (e) {
      console.log("Failed to get balance", e);
      res.status(500).send({
        error: "USR-02",
        message: "Failed to get balance",
      });
    }
  };

  get = async (req: Request, res: Response) => {
    try {
      const id: number = parseInt(req.params.id);
      const usuario: ClienteIn | null = await userModel.get(id);
      const contaUsuario: ContaIn | null = await accountModel.getByIdUser(id)

      const formattedAccount = {
        nome: usuario?.nome,
        cpf: usuario?.cpf,
        numero_agencia: contaUsuario?.numero_agencia,
        numero_conta: contaUsuario?.numero_conta
      }

      if (contaUsuario) {
        const outpuUser = formatacaoOutput.excludeKeys(formattedAccount, ['senha'])
        res.status(200).json(outpuUser);
      } else {
        res.status(404).json({
          error: "USR-06",
          message: "User not found.",
        });
      }
    } catch (e) {
      console.log("Failed to get user", e);
      res.status(500).send({
        error: "USR-02",
        message: "Failed to get user",
      });
    }
  };
  getAll = async (req: Request, res: Response) => {
    try {
      const users: ClienteOut[] | null = await userModel.getAll();
      const accounts: ContaOut[] | null = await accountModel.getAll();
      const outputAccount = formatacaoOutput.excludeArrayKeys(accounts, ['senha_4d']);
      const outpuUser = formatacaoOutput.excludeArrayKeys(users, ['senha']) && outputAccount;
      res.status(200).json(outpuUser);
    } catch (e) {
      console.log("Failed to get all users", e);
      res.status(500).send({
        error: "USR-03",
        message: "Failed to get all users",
      });
    }
  };
  updateSenha4D = async (req: Request, res: Response) => {
    try {
      const id: number = parseInt(req.params.id);
      const updateUser: ContaIn = req.body;
      const senhaAtual = req.body.senhaAtual;

      const usuario: ClienteIn | null = await userModel.get(id);
      if (!usuario) {
        return res.status(404).json({
          error: "USR-06",
          message: "usuário não encontrado",
        });
      }

      const contaUsuario: ContaIn | null = await accountModel.findOneById(usuario.id_cliente);
      if (!contaUsuario) {
        return res.status(404).json({
          error: "USR-06",
          message: "Conta do usuário não encontrada",
        });
      }

      if (!await compare(senhaAtual, contaUsuario?.senha_4d)) {
        return res.status(404).json({
          message: "Senha atual incorreta",
        });

      }
      const hashNovaSenha = await bcrypt.hash(updateUser.senha_4d, 10);
      if (await compare(senhaAtual, hashNovaSenha)) {
        return res.status(404).json({
          message: "A nova senha não pode ser igual a antiga",
        });
      }
      else {
        const hashSenha = await bcrypt.hash(updateUser.senha_4d, 10)

        updateUser.senha_4d = hashSenha;
        
        const userUpdated: ContaOut | null = await accountModel.update(
          id,
          updateUser.senha_4d
        );
        if (userUpdated) {
          const outputUser = {
            message: "Senha atualizada com sucesso"
          }
          res.status(200).json(outputUser);
        } else {
          res.status(404).json({
            error: "USR-06",
            message: "usuário não encontrado",
          });
        }
      }
    } catch (e) {
      console.log("Failed to update user", e);
      res.status(500).send({
        error: "USR-04",
        message: "Falha em atualizar senha transacional",
      });
    }
  };
}

