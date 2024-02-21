// import { EnderecoIn } from "./EnderecoDTO";

import { Tipo_Cargo } from "@prisma/client";
import { EnderecoIn } from "./EnderecoDTO";

export interface ClienteIn {
  id_cliente: number;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  data_nasc: Date | string;
  senha: string;
  tipo: Tipo_Cargo;
}

export interface ClienteOut {
  id_cliente: number;
  email: string;
  nome: string | null;
}