
import {Request, Response} from 'express';
import {generateKeys, RsaPublicKey, RsaPrivateKey, RsaKeyPair} from '@scbd/rsa';
import * as sha from 'object-sha';
import * as bic from 'bigint-conversion';
import keys from '../index';
const bitLength = 1024;

export async function generateBothKeys(req: Request, res: Response): Promise<Response>{
    const keyPair: RsaKeyPair = await generateKeys(bitLength);
    const key = {
        e: bic.bigintToBase64(keyPair.publicKey.e),
		n: bic.bigintToBase64(keyPair.publicKey.n)
    }
    return res.status(201).json(key);
}

export async function getServerPubK(req: Request, res: Response): Promise<Response>{
	const key = {
		e: await (await keys).publicKey.e,
		n: await (await keys).publicKey.n
	}
	return res.status(201).json(key);
}

export async function signMsg(req: Request, res: Response): Promise<Response>{
	const msg = req.body
	const privKey: RsaPrivateKey = await (await keys).privateKey;
	const signed: string = await bic.bigintToBase64(privKey.sign(msg))

	return res.status(201).json({signature: signed});
}