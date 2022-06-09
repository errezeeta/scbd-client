import {Router} from 'express';
import * as rsa from '../controllers/rsa.controller';


const rsaRouter = Router();

rsaRouter.route('/generateKeys')
	.get(rsa.generateBothKeys)

export default rsaRouter;