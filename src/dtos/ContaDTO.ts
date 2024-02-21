import { ClienteOut } from "./ClientesDTO";

export interface ContaIn {
    numero_agencia: string;
    numero_conta: string;
    saldo: number;
    senha_4d: string;
    
}

export interface ContaOut {
    id_conta?: number;
    id_cliente?: number;
} 

export enum Status_c {
    ativa = "ativa",
    inativa = "inativa",
    bloqueada = "bloqueada"
  }