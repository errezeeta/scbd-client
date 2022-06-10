import app from "./app";
import {generateKeys, RsaKeyPair} from '@scbd/rsa';
import * as bic from 'bigint-conversion';
import userList from "./data";
import fetch from 'node-fetch';
import { response } from "express";
const bitLength = 1024


async function main() {

    const keyPair: RsaKeyPair = await generateKeys(bitLength);
    const keyCE = await fetch('http://localhost:8080/rsa/pubk_ce', {
      method: 'POST',
      body: JSON.stringify({
        username: 'admin',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log(await response.json())
    const PORT = app.get('PORT');
    await app.listen(PORT);
    console.log('Servidor abierto en: ', PORT);
    return keyPair;
}

const keys = main();
export default keys;