import {Router} from 'express';
import * as rsa from '../controllers/rsa.controller';


const rsaRouter = Router();

rsaRouter.route('/generateKeys')
	.get(rsa.generateBothKeys)

rsaRouter.route('/pubK_CE')
	.get(rsa.getServerPubK)

rsaRouter.route('/sign')
	.get(rsa.signMsg)

export default rsaRouter;