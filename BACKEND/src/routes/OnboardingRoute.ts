import { Router } from 'express';
import { validation } from 'middlewares/auth';
import OnboardingController from 'controllers/UserController';
import UserController from 'controllers/UserController';

const routes = Router();
const userController = new UserController();

routes.post('/', validation, userController.create);

export default routes;