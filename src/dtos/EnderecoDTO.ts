import { ClienteIn } from "./ClientesDTO";

export interface EnderecoIn {
  id_endereco?: number;
  id_cliente: ClienteIn;
  cep: string;
  rua: string;
  bairro: string;
  numero: string;
  complemento: string;
  cidade: string;
  estado: string;
}

export interface EnderecoOut{
  id_endereco?: number;
}