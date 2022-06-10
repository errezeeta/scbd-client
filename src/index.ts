import app from "./app";
import {generateKeys, RsaKeyPair} from '@scbd/rsa';
import * as bic from 'bigint-conversion';
import userList from "./data";
const bitLength = 1024


async function main() {

    const keyPair: RsaKeyPair = await generateKeys(bitLength);
    const PORT = app.get('PORT');
    await app.listen(PORT);
    console.log('Servidor abierto en: ', PORT);
    return keyPair;
}

const keys = main();
export default keys;