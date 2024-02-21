import { Router } from 'express';
import { tokenAuthentication } from 'middlewares/auth';
import TransferenceController from 'controllers/TransferenceController';

const routes = Router();
const transferenceController = new TransferenceController();

routes.post('/:id', tokenAuthentication, transferenceController.Transferencia);
routes.get('/comprovante/:id', transferenceController.Comprovante);
routes.get('/extrato/:id', tokenAuthentication, transferenceController.Extrato);

export default routes;