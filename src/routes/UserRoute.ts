import { Router } from 'express';
import UserController from 'controllers/UserController';
import { validation, tokenAuthentication} from 'middlewares/auth';
import AccountController from 'controllers/AccountController';

const routes = Router();
const userController = new UserController();
const accountController = new AccountController();

routes.post('/', validation, userController.create);
routes.get('/', userController.getAll);
routes.get('/conta/:conta', userController.getNumeroConta);
routes.get('/accounts', accountController.getAll);
routes.get('/:id', tokenAuthentication, accountController.get);
routes.get('/cpf/:cpf', userController.getCPF);
routes.get('/endereco/:id', tokenAuthentication, userController.getEndereco);
routes.put('/endereco/:id', tokenAuthentication, userController.updateEndereco);
routes.put('/configtransf/:id', tokenAuthentication, accountController.updateSenha4D)
routes.put('/:id', userController.update);
routes.delete('/:id', userController.delete);
routes.post('/login', userController.login);

export default routes;