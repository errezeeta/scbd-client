import app from "./app";
import {generateKeys, RsaKeyPair} from '@scbd/rsa';
import * as bic from 'bigint-conversion';
const bitLength = 1024


async function main() {

    const keyPair: RsaKeyPair = await generateKeys(bitLength);
    const key = {
        e: bic.bigintToBase64(keyPair.publicKey.e),
		n: bic.bigintToBase64(keyPair.publicKey.n)
    }
    const PORT = app.get('PORT');
    await app.listen(PORT);
    console.log('Servidor abierto en: ', PORT);
    return key;
}

const keys = main();
export default keys;