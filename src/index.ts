import app from "./app";
import {generateKeys, RsaKeyPair, RsaPublicKey} from '@scbd/rsa';
import * as bic from 'bigint-conversion';
import userList from "./data";
import fetch from 'node-fetch';
import { response } from "express";
import { json } from "stream/consumers";
const bitLength = 1024


async function main() {

    const keyPair: RsaKeyPair = await generateKeys(bitLength);
    const PORT = app.get('PORT');
    await app.listen(PORT);
    console.log('Servidor abierto en: ', PORT);
    return keyPair;
}

async function getCEkeys() {
  const response = await fetch("http://localhost:8080/rsa/pubk_ce", {
      method: 'POST',
      body: JSON.stringify({
        username: 'admin',
      }),
      headers: {'Content-Type': 'application/json',
    } 
    });
    const data = await response.json();
    const pubk_ceJS = (JSON.parse(JSON.stringify(data)));
    const pubk_ce = new RsaPublicKey(pubk_ceJS.e, pubk_ceJS.n);
    return pubk_ce;
}

const keys = main();
const pubk_ce = getCEkeys();
export { keys };
export { pubk_ce };