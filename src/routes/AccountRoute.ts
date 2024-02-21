import { Router } from 'express';
import AccountController from 'controllers/AccountController';
import { tokenAuthentication } from 'middlewares/auth';

const routes = Router();
const accountController = new AccountController();

routes.get('/saldo/:id', tokenAuthentication, accountController.getSaldo);

export default routes;