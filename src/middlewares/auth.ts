import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import UserModel from "models/UserModel";
import AccountModel from "models/AccountModel";
import { ContaIn } from 'dtos/ContaDTO';
import { ClienteIn } from "dtos/ClientesDTO";
import { TransferenciaIn } from 'dtos/TransferenciaDTO';
import { validar_cpf, checar_senha_app, checar_senha4d, validar_email, validar_telefone, verificar_saldo, checar_senha_trans } from "util/functions";


export const validation = (req: Request, res: Response, next: NextFunction) => {
  // validação
  const notValid = false;
  const array = new Array();

  if (notValid) {
    array.push({ 'message': 'deu erro...' })
  }

  if (!validar_cpf(req.body.usuario.cpf)) {
    array.push({ 'message': 'cpf inválido' })
  }

  if (!checar_senha_app(req.body.usuario.senha)) {
    array.push({ 'messsage': 'senha inválida' })
  }

  // if (!checar_senha_trans(req.body.usuario.senha)) {
  //   array.push({ 'messsage': 'senha transacional inválida' })
  // }

  if (!validar_email(req.body.usuario.email)) {
    array.push({ 'messsage': 'email inválido' })
  }

  if (!validar_telefone(req.body.usuario.telefone)) {
    array.push({ 'messsage': 'telefone inválido' })
  }

  if (array.length > 0) {
    return res.status(401).send(array);
  }

  next();

  // if(!validar_cep(req.body.cep)){
  //   return res.status(401).send({'messsage': 'cep inválido'});
  // }

}

//////////////////////////////////////////////////////////////////////////////////////////////

interface TokenDecodificado {
  cliente_id: number;
}

export const tokenAuthentication = async (req: Request, res: Response, next: NextFunction) => {
  const userModel = new UserModel();
  const token = req.headers.authorization?.split(' ')[1];
  try {
    // verificar se o usuario tem algum token
    if (!token) {
      return res.status(401).send({ 'message': 'token não encontrado' });
    }

    const senhaJWT = process.env.JWT_SENHA?.toString();
    if (senhaJWT) {
      const { cliente_id } = jwt.verify(token, senhaJWT) as TokenDecodificado;
      const cliente_id_int = parseInt(cliente_id, 10);
      const idRoute: number = parseInt(req.params.id);
      try {
        const user: ClienteIn | null = await userModel.get(idRoute);
        if (user) {
          if (cliente_id_int === idRoute) {

            const { senha: _, ...userLog } = user;
            next();
          }
          else {
            return res.status(401).send({ 'message': 'Usuário inválido' });
          }
        }
      } catch (e) {
        return res.status(401).send({ 'message': 'Token inválido' });
      }
    }
  } catch (e) {
    return res.status(500).send({ 'messsage': 'Falha validar acesso' + e });
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////

export const transferValidation = async (req: Request, res: Response, next: NextFunction) => {
  const accountModel = new AccountModel();

  if (!checar_senha4d(req.body.senha_4d)) {
    return res.status(401).send({ 'messsage': 'Senha transacional inválida' });
  }

}

//////////////////////////////////////////////////////////////////////////////////////////////