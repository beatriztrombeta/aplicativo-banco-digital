export interface TransferenciaIn{
    id_transferencia?: number;
    id_origem: number;
    id_destino: number;
    valor: number;
    status_transferencia: Status_t;
    data_transferencia: Date;
    descricao: string;
}

export interface TransferenciaOut{
    id_transferencia?: number;
    id_conta_origem?: number;
    id_conta_destino?: number;
}

export enum Status_t {
    enviada = "enviada",
    rejeitada = "rejeitada"
}

export interface Transferencia_In{
    id_transferencia?: number;
    id_origem: number;
    id_destino: number;
    valor: number;
    status_transferencia: Status_t;
    data_transferencia: Date;
    descricao: string;
    cpf?: string;
    senha_4d?: string;
    numero_conta?: string;
}
