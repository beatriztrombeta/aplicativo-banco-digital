import { Request, Response } from "express";
import { ClienteIn, ClienteOut } from "dtos/ClientesDTO";
import { EnderecoIn, EnderecoOut } from "dtos/EnderecoDTO";
import { ContaIn, ContaOut } from "dtos/ContaDTO";
import UserModel from "models/UserModel";
import AddressModel from "models/AddressModel";
import { numero_randomico, generateUserToken } from "util/functions";
import formatacaoOutput from "util/formatacao";
import bcrypt, { compare } from 'bcrypt';
import AccountModel from "models/AccountModel";
import * as nodemailer from "nodemailer";
import * as crypto from "crypto";
import { error } from "console";


const userModel = new UserModel();
const addressModel = new AddressModel();
const accountModel = new AccountModel();


export default class UserController {
  create = async (req: Request, res: Response) => {
    try {
      let user: ClienteIn = req.body.usuario;
      let account: ContaIn = req.body.usuario.conta;
      const address: EnderecoIn = req.body.usuario.endereco;

      const cpf_existente: ClienteIn | null = await userModel.findOneByCPF(req.body.usuario.cpf);
      console.log(cpf_existente)
      if(!cpf_existente){

        account.numero_agencia = "001";
        account.numero_conta = numero_randomico(0, 999999).toString();
        account.saldo = 0;
  
        const hashSenha = await bcrypt.hash(user.senha, 10)
        const hashSenha4d = await bcrypt.hash(account.senha_4d, 10)
        user.senha = hashSenha;
        account.senha_4d = hashSenha4d;
  
        await userModel.create(user, address, account);
        res.status(201).json({ message: "newUser" });
      }
      else{
        console.log("Já existe um usuário com esse CPF")
        res.status(500).send({
          error: "USR-01",
          message: "CPF inválido, tente novamente.",
        });
      }

    } catch (e) {
      console.log("Failed to create user" + e);
      res.status(500).send({
        error: "USR-01",
        message: "Failed to create user",
      });
    }
  };

  get = async (req: Request, res: Response) => {
    try {
      const id: number = parseInt(req.params.id);
      const newUser: ClienteOut | null = await userModel.get(id);
      const contaUsuario = await accountModel.get(newUser?.id_cliente);

      if (contaUsuario?.status_conta === "ativa") {
        if (newUser) {
          const outpuUser = formatacaoOutput.excludeKeys(newUser, ['senha'])
          res.status(200).json(outpuUser);
        } else {
          res.status(404).json({
            error: "USR-06",
            message: "User not found.",
          });
        }
      }
      else {
        res.status(423).json({
          error: "USR-06",
          message: "The user is locked due an inactivity of the user.",
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

  getCPF = async (req: Request, res: Response) => {
    try {
      const cpf: string = (req.params.cpf);
      const user: ClienteIn | null = await userModel.findOneByCPF(cpf);

      
      if (user) {
        const contaUsuario = await accountModel.findOneById(user?.id_cliente);

          const outpuUser = formatacaoOutput.excludeKeys(user, ['senha'])
          const outputAccount = formatacaoOutput.excludeKeys(contaUsuario, ['senha_4d'])
          res.status(200).json({ user: outpuUser, account: outputAccount });
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

  getNumeroConta = async (req: Request, res: Response) => {
    try {
      const conta: string = (req.params.conta);
      const contaUsuario = await accountModel.getByNumberAccount(conta);

        if (contaUsuario) {
          const user = await userModel.findOneById(contaUsuario?.cliente_id);

          const outpuUser = formatacaoOutput.excludeKeys(user, ['senha'])
          const outputAccount = formatacaoOutput.excludeKeys(contaUsuario, ['senha_4d'])
          res.status(200).json({ user: outpuUser, account: outputAccount });
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
      const outpuUser = formatacaoOutput.excludeArrayKeys(users, ['senha']);
      res.status(200).json(outpuUser);
    } catch (e) {
      console.log("Failed to get all users", e);
      res.status(500).send({
        error: "USR-03",
        message: "Failed to get all users",
      });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const id: number = parseInt(req.params.id);
      const updateUser: ClienteIn = req.body;
      const senhaAtual = req.body.senhaAtual;

      const usuario: ClienteIn | null = await userModel.get(id);
      if (!usuario){
        return res.status(404).json({
          error: "USR-06",
          message: "usuário não encontrado",
        });
      }
      if (!await compare(senhaAtual, usuario.senha)){
        return res.status(404).json({
          message: "Senha atual incorreta",
        });
      }
      const hashNovaSenha = await bcrypt.hash(updateUser.senha, 10);
      if(await compare(senhaAtual, hashNovaSenha)){
        return res.status(404).json({
          message: "A nova senha não pode ser igual a antiga",
        });
      }
      else {
        const hashSenha = await bcrypt.hash(updateUser.senha, 10);

        updateUser.senha = hashSenha;

        const userUpdated: ClienteIn | null = await userModel.updateSenha(id, updateUser.senha);
      
        if (userUpdated) {
          const outputUser = {
            message: "Senha atualizada com sucesso"
          };
          res.status(200).json(outputUser);
        } else {
          res.status(404).json({
            error: "USR-06",
            message: "Usuário não encontrado.",
          });
        }
      }
      
    } catch (e) {
      console.log("Failed to update user", e);
      res.status(500).send({
        error: "USR-04",
        message: "Falha em atualizar senha",
      });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const id: number = parseInt(req.params.id);
      const user = await accountModel.get(id);
      if (user?.status_conta === "ativa") {
        user.status_conta = "inativa";
      }

      res.status(204).json({ message: "Usuário deletado com sucesso." });
    } catch (e) {
      console.log("Failed to delete user", e);
      res.status(500).send({
        error: "USR-05",
        message: "Failed to delete user",
      });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const body = req.body;
      const user: ClienteIn | null = await userModel.findOneByCPF(body.cpf);


      let match: boolean;

      if (user) {

        match = bcrypt.compareSync(body.senha, user.senha);

        if (!match) {
          res.status(404).json({
            error: "USR-06",
            message: "Senha inválida, tente novamente.",
          });
          return;
        }

        res.status(200).json({
          id: user.id_cliente,
          nome: user.nome,
          email: user.email,
          cargo: user.tipo,
          token: generateUserToken(user.id_cliente.toString())
        });

      }
      else{
        res.status(404).json({
          error: "USR-06",
          message: "Existem campos incompletos ou CPF inválido, tente novamente.",
        });
        return;
      }
    } catch (e) {
      console.log("Failed to get user", e);
      res.status(500).send({
        error: "USR-02",
        message: "Failed to get user",
      });
    }
  };

  getEndereco = async (req: Request, res: Response) => {
    try {
      const id: number = parseInt(req.params.id);
      const usuario: ClienteIn | null = await userModel.get(id);
      const contaUsuario = await accountModel.get(usuario?.id_cliente);

      if (usuario) {
        const enderecoUsuario = await addressModel.get(id)
        console.log(enderecoUsuario)
        if (enderecoUsuario) {
          const formattedAddress = {
            cep: enderecoUsuario.cep,
            rua: enderecoUsuario.rua,
            bairro: enderecoUsuario.bairro,
            numero: enderecoUsuario.numero,
            complemento: enderecoUsuario.complemento,
            cidade: enderecoUsuario.cidade,
            estado: enderecoUsuario.estado
          }
          res.status(200).json(formattedAddress);
        } else {
          res.status(404).json({
            error: "USR-06",
            message: "Address not found.",
          });
        }
      }
    } catch (e) {
      console.log("Failed to get user", e);
      res.status(500).send({
        error: "USR-02",
        message: "Failed to get user",
      });
    }
  };
  updateEndereco = async (req: Request, res: Response) => {
    try {
      const id: number = parseInt(req.params.id);
      const usuario: ClienteIn | null = await userModel.get(id);
      const contaUsuario = await accountModel.get(usuario?.id_cliente);
      const updateAddress: EnderecoIn = req.body;

      if (usuario?.id_cliente) {
        const addressUpdated: EnderecoOut | null = await addressModel.update(
          usuario?.id_cliente,
          updateAddress
        );
        if (addressUpdated) {
          const outputAddress = {
            message: "Endereço atualizado com sucesso"
          }
          res.status(200).json(outputAddress);
        } else {
          res.status(404).json({
            error: "USR-06",
            message: "Endereço não encontrado",
          });
        }
      }
    } catch (e) {
      console.log("Falha ao atualizar endereço", e);
      res.status(500).send({
        error: "USR-04",
        message: "Falha ao atualizar endereço",
      });
    }
  };
  // esqueciSenha = async (req: Request, res: Response) => {
  //   try {
  //     const cpf = req.body.cpf;
  //     const user: any = await userModel.findOneByCPF(cpf);
  //     const email = user?.email;

  //     const transporter = nodemailer.createTransport({
  //         host: "sandbox.smtp.mailtrap.io",
  //         port: 2525,
  //         auth: {
  //           user: "0ee68c3a94fcd5",
  //           pass: "a866d43c6aa87a"
  //         }
  //     });

  //     const novaSenha = crypto.randomBytes(4).toString('hex')

  //     transporter.sendMail({
  //       from: 'Administrador <658e3f3f89-92d07e+1@inbox.mailtrap.io>',
  //       to: email,
  //       subject: 'Recuperação de senha',
  //       text: 'Olá sua nova senha para acessar o sistema é: ${novaSenha}'
  //     }).then(
  //       () => {
  //         user.senha = novaSenha;
  //         const hashSenha = bcrypt.hash(user.senha, 10);
  //         user.senha = hashSenha;
  //         return res.status(200).json({message: "E-mail enviado"})
  //       }
  //     ).catch(error);{
  //       return res.status(404).json({message: "Usuário não encontrado"})
  //     }

  //   } catch (error){
  //     return res.status(404).json({message: "Failed to send e-mail"})
  //   }
  // }
};
