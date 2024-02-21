import { Request, Response } from "express";
import { Conta, PrismaClient } from '@prisma/client';
import UserModel from "models/UserModel";
import AccountModel from "models/AccountModel";
import TransferenceModel from "models/TransferenceModel";
import { Status_t, TransferenciaIn, TransferenciaOut, Transferencia_In } from "dtos/TransferenciaDTO";
import { verificar_saldo } from "util/functions";
import bcrypt from 'bcrypt';


const accountModel = new AccountModel();
const userModel = new UserModel();
const transferenceModel = new TransferenceModel();


export default class TransferenceAccount {
    //Transferência entre contas
    Transferencia = async (req: Request, res: Response) => {
        try {
            //Dados do rementente 
            const id_remetente: number = parseInt(req.params.id);
            const conta_remetente = await accountModel.getByIdUser(id_remetente);
            const remetente = await userModel.findOneById(id_remetente);

            const transference: Transferencia_In = req.body;

            if (transference?.cpf) {
                const destinatario = await userModel.findOneByCPF(transference.cpf);
                if (destinatario?.cpf === remetente?.cpf) {
                    return res.status(401).json({ message: 'você não pode fazer uma transferencia para si mesmo' });
                }
                if (destinatario?.id_cliente) {
                    const conta_destinatario = await accountModel.getByIdUser(destinatario.id_cliente);
                    if (conta_destinatario?.status_conta === "ativa") {

                        const id_destinatario = conta_destinatario.id_conta;
                        if (conta_remetente?.saldo) {
                            if(verificar_saldo(conta_remetente.saldo, transference.valor)){
                                var saldoNovoR = Number(conta_remetente.saldo) - Number(transference.valor);
                                conta_remetente.saldo = saldoNovoR;
                                if (conta_destinatario?.saldo || conta_destinatario?.saldo === 0) {
                                    var saldoNovoD = Number(conta_destinatario.saldo) + Number(transference.valor);
                                    conta_destinatario.saldo = saldoNovoD;
                                    let match: boolean;
                                    if (transference.senha_4d) {
                                        match = bcrypt.compareSync(transference.senha_4d, conta_remetente?.senha_4d);
    
    
                                        if (match) {
                                            if (conta_remetente?.id_conta) {
                                                await accountModel.updateConta(conta_remetente.id_conta, conta_remetente);
    
                                                if (conta_destinatario?.id_conta) {
                                                    await accountModel.updateConta(conta_destinatario.id_conta, conta_destinatario);
    
                                                    //criar na tabela de transferencia
                                                    let transferencia: Transferencia_In = req.body;
                                                    transferencia.id_origem = conta_remetente.id_conta;
                                                    transferencia.id_destino = id_destinatario;
                                                    transferencia.valor = req.body.valor;
                                                    transferencia.status_transferencia = Status_t.enviada;
                                                    transferencia.descricao = req.body.descricao;
    
                                                    const result =  await transferenceModel.create(transferencia);
                                                    
                                                    const formattedTransaction = {
                                                        // id: result.id_transferencia,
                                                        de: remetente?.nome,
                                                        para: destinatario?.nome,
                                                        valor: transferencia.valor,
                                                        data: new Date().toLocaleDateString("pt-BR"),
                                                        tipo: "saldo em conta",
                                                        descricao: transferencia.descricao
                                                    }

                                                    
                                                    res.status(200).json({
                                                        message: "Transferencia feita com sucesso.",
                                                        transferencia: formattedTransaction,
                                                    });
                                                } else {
                                                    return res.status(404).json({ message: 'destinatário inválido' });
                                                }
                                            } else {
                                                return res.status(404).json({ message: 'remetente inválido' });
                                            }
                                        }
                                        else {
                                            return res.status(412).json({ message: 'senha incorreta' });
                                        }
                                    }
                                } else {
                                    return res.status(412).json({ message: 'saldo da conta destinatário como falso' });
                                }
                            }else{
                                return res.status(412).json({ message: 'conta sem saldo suficiente' });
                            }
                        } else {
                            return res.status(412).json({ message: 'saldo do remetente como falso' });
                        }
                    }
                    else {
                        return res.status(423).json({ message: "Can't transfer the user because his account is locked due an inactivity.", });
                    }
                } else {
                    return res.status(404).json({ message: 'destinatário não existe' });
                }
            }
            else if (transference?.numero_conta) {
                const num_cont_destinatario = req.body.numero_conta;
                const destinatario = await accountModel.getByNumberAccount(num_cont_destinatario);
                if (destinatario?.numero_conta === conta_remetente?.numero_conta) {
                    return res.status(401).json({ message: 'você não pode fazer uma transferencia para si mesmo' });
                }
                if (destinatario?.cliente_id) {
                    const conta_destinatario = await accountModel.getByIdUser(destinatario.cliente_id);
                    if (conta_destinatario?.status_conta === "ativa") {
                        if (conta_remetente?.saldo) {
                            const id_destinatario = conta_destinatario.id_conta;
                            verificar_saldo(conta_remetente.saldo, transference.valor);
                            var saldoNovoR = Number(conta_remetente.saldo) - Number(transference.valor);
                            conta_remetente.saldo = saldoNovoR;
                            if (conta_destinatario?.saldo) {
                                var saldoNovoD = Number(conta_destinatario.saldo) + Number(transference.valor);
                                conta_destinatario.saldo = saldoNovoD;
                                let match: boolean;
                                if (transference.senha_4d) {


                                    match = bcrypt.compareSync(transference.senha_4d, conta_remetente?.senha_4d);
                                    if (match) {
                                        if (conta_remetente?.id_conta) {
                                            await accountModel.updateConta(conta_remetente.id_conta, conta_remetente);

                                            if (conta_destinatario?.id_conta) {
                                                await accountModel.updateConta(conta_destinatario.id_conta, conta_destinatario);
                                                //criar na tabela de transferencia
                                                let transferencia: Transferencia_In = req.body;
                                                transferencia.id_origem = conta_remetente.id_conta;
                                                transferencia.id_destino = id_destinatario;
                                                transferencia.valor = req.body.valor;
                                                transferencia.descricao = req.body.descricao;
                                                transferencia.cpf = undefined;
                                                transferencia.senha_4d = undefined;
                                                transferencia.numero_conta = undefined;

                                                await transferenceModel.create(transferencia);

                                                const formattedTransaction = {
                                                    id: transferencia.id_transferencia,
                                                    de: remetente?.nome,
                                                    valor: transferencia.valor,
                                                    descricao: transferencia.descricao
                                                }

                                                await transferenceModel.create(transferencia);
                                                res.status(200).json({
                                                    message: "Transferencia feita com sucesso.",
                                                    transferencia: formattedTransaction
                                                });
                                            } else {
                                                return res.status(404).json({ message: 'destinatário inválido' });
                                            }
                                        } else {
                                            return res.status(404).json({ message: 'remetente inválido' });
                                        }
                                    }
                                    else {
                                        return res.status(412).json({ message: 'senha incorreta' });
                                    }
                                }
                            } else {
                                return res.status(412).json({ message: 'saldo da conta destinatário como falso' });
                            }
                        } else {
                            return res.status(412).json({ message: 'conta sem saldo suficiente' });
                        }
                    }
                    else {
                        return res.status(423).json({ message: "Can't transfer the user because his account is locked due an inactivity.", });
                    }
                } else {
                    return res.status(404).json({ message: 'destinatário não existe' });
                }
            }

        } catch (e) {
            console.log('Failed to perform transfer', e);
            res.status(500).json({ message: 'Falha ao realizar a transferência' + e });
        }
    }

    Comprovante = async (req: Request, res: Response) => {
        try {
            const id_transferencia: number = parseInt(req.params.id);
            const transaction = await transferenceModel.get(id_transferencia);

            const id_conta_remetente = transaction?.id_origem;
            if (id_conta_remetente) {
                var conta_remetente = await accountModel.getByIdAccount(id_conta_remetente);
                const remetente = await userModel.findOneByIdNotUnique(conta_remetente?.cliente_id);

                const id_conta_destinatario: number | undefined = transaction?.id_destino;
                if (id_conta_destinatario) {
                    const conta_destinatario = await accountModel.get(id_conta_destinatario);
                    if (conta_destinatario?.cliente_id) {
                        const destinatario = await userModel.findOneById(conta_destinatario?.cliente_id);

                        if (transaction) {
                            const formattedTransaction = {
                                transferencia: transaction.id_transferencia,
                                data: transaction.data_transferencia,
                                tipo: "saldo em conta",
                                de: remetente?.nome,
                                para: destinatario?.nome,
                                valor: transaction.valor,
                                descricao: transaction.descricao
                            }
                            res.status(200).json({ transferencia: formattedTransaction });
                        } else {
                            res.status(404).json({
                                error: "USR-06",
                                message: "Transaction not found.",
                            });
                        }
                    }
                }
            }
        } catch (e) {
            console.log("Failed to get user", e);
            res.status(500).send({
                error: "USR-02",
                message: "Failed to get user",
            });
        }
    }

    Extrato = async (req: Request, res: Response) => {
        try {
            const id_cliente: number = parseInt(req.params.id);
            const conta_cliente = await accountModel.getByIdUserNotUnique(id_cliente);
            const cliente = await userModel.findOneByIdNotUnique(conta_cliente?.cliente_id);
            const filtros = req.query;

            let extrato;

            var page = parseInt(req.query.page as string);

            var data_inicio = filtros.inicio ? new Date(filtros.inicio.toString()) : undefined;
            var data_fim = filtros.fim ? new Date(filtros.fim.toString()) : undefined;
            var dtAtual = new Date();
            dtAtual = new Date(dtAtual.toString());

            data_inicio === undefined && data_fim !== undefined ? data_inicio = data_fim : data_inicio = data_inicio;
            data_fim === undefined && data_inicio !== undefined ? data_fim = dtAtual : data_fim = data_fim;
            filtros.filtro === undefined ? filtros.filtro = 'desc' : filtros.filtro = filtros.filtro;


            if (data_inicio && data_fim) {
                let dtInicio = new Date(data_inicio.toISOString());
                let dtFim = new Date(data_fim.toISOString());

                dtInicio = new Date(dtInicio.getUTCFullYear(), dtInicio.getUTCMonth(), dtInicio.getUTCDate());
                dtFim = new Date(dtFim.getUTCFullYear(), dtFim.getUTCMonth(), dtFim.getUTCDate());

                let inicio = dtInicio.toISOString();
                let fim = dtFim.toISOString();
                inicio = inicio.split("T")[0] + 'T00:00:00.000Z';
                fim = fim.split("T")[0] + 'T23:59:59.999Z'

                if (conta_cliente?.id_conta) {
                    if (filtros.filtro === "entrada") {
                        extrato = await transferenceModel.getEntradas(conta_cliente?.id_conta, inicio, fim, page, 'desc');
                    }
                    else if (filtros.filtro === "entrada" && filtros.tipo === "asc") {
                        extrato = await transferenceModel.getEntradas(conta_cliente?.id_conta, inicio, fim, page, 'asc');
                    }

                    else if (filtros.filtro === "saida") {
                        extrato = await transferenceModel.getSaidas(conta_cliente?.id_conta, inicio, fim, page, 'desc');
                    }
                    else if (filtros.filtro === "saida" && filtros.tipo === "asc") {
                        extrato = await transferenceModel.getSaidas(conta_cliente?.id_conta, inicio, fim, page, 'asc');
                    }

                    else {
                        if(filtros.tipo === 'asc'){
                            extrato = await transferenceModel.getTodas(conta_cliente?.id_conta, inicio, fim, page, 'asc');
                        }
                        else{
                            extrato = await transferenceModel.getTodas(conta_cliente?.id_conta, inicio, fim, page, 'desc');
                        }
                    }
                }
            }
            else {
                if (conta_cliente?.id_conta) {
                    if (filtros.filtro === "entrada") {
                        extrato = await transferenceModel.getEntradas(conta_cliente?.id_conta, data_inicio, data_fim, page, 'desc');
                    }
                    if (filtros.filtro === "entrada" && filtros.tipo === "asc") {
                        extrato = await transferenceModel.getEntradas(conta_cliente?.id_conta, data_inicio, data_fim, page, 'asc');
                    }

                    else if (filtros.filtro === "saida") {
                        extrato = await transferenceModel.getSaidas(conta_cliente?.id_conta, data_inicio, data_fim, page, 'desc');
                    }
                    else if (filtros.filtro === "saida" && filtros.tipo === "asc") {
                        extrato = await transferenceModel.getSaidas(conta_cliente?.id_conta, data_inicio, data_fim, page, 'asc');
                    }

                    else {
                        if(filtros.tipo === 'asc'){
                            extrato = await transferenceModel.getTodas(conta_cliente?.id_conta, data_inicio, data_fim, page, 'asc');
                        }
                        else{
                            extrato = await transferenceModel.getTodas(conta_cliente?.id_conta, data_inicio, data_fim, page, 'desc');
                        }
                    }
                }

            }
            return res.status(200).json({ extrato: extrato })
        } catch (e) {
            console.log('Failed to perform the bank statement', e);
            res.status(500).json({ message: 'Ocorreu um erro ao recuperar o extrato de transações.' + e });
        }
    }
}