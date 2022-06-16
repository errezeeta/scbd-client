
import {generateKeys, RsaKeyPair, RsaPublicKey} from '@scbd/rsa';
import * as sha from 'object-sha';
import * as bic from 'bigint-conversion';
import * as bcu from 'bigint-crypto-utils';
import fetch from 'node-fetch';
const bitLength = 1024;
const user = "Messi";
const pass= "10";

async function keyGen() {
  const keyPair: RsaKeyPair = await generateKeys(bitLength);
  return keyPair;
}

async function login(): Promise <RsaPublicKey> {
  var boolean = false;
  const response = await fetch("http://localhost:8080/rsa/login", {
      method: 'POST',
      body: JSON.stringify({
        username: user,
        password: pass,
      }),
      headers: {'Content-Type': 'application/json',
    } 
    });
    const data = await response.json();
    const parsedData = await (JSON.parse(JSON.stringify(data)));
    if (await parsedData.message === "login complete") {
      boolean = true;
      const secondRes = await fetch("http://localhost:8080/rsa/pubK_CE", {
        method: 'POST',
        body: JSON.stringify({
          username: user,
          password: pass,
        }),
        headers: {'Content-Type': 'application/json',
      } 
      });
      const res = await secondRes.json();
      const parsedKeys = await (JSON.parse(JSON.stringify(res)));
      const keysCE = new RsaPublicKey(bic.base64ToBigint(parsedKeys.e), bic.base64ToBigint(parsedKeys.n));
      return keysCE;
    }
    console.log(boolean);
}

async function getCert(): Promise <String> {
    const intent = (await keys).publicKey.toJsonString();
    const j = sha.digest(intent);
    console.log("PRUEBA: " +await j);
    const msgBI = bic.base64ToBigint(await j);
    console.log(msgBI);
    const r = bcu.randBetween((await keys).publicKey.n - 1n)
    const blindMsg = msgBI * bcu.modPow(r, (await keysCE).e, (await keysCE).n);
    const blindMsgB64 = bic.bigintToBase64(blindMsg);
    const response = await fetch("http://localhost:8080/rsa/sign", {
      method: 'POST',
      body: JSON.stringify({
        message: blindMsgB64,
      }),
      headers: {'Content-Type': 'application/json',
    } 
    });
    const data = await response.json();
    const parsedData = await (JSON.parse(JSON.stringify(data)));
    console.log ("La data dcuelta es: " +await parsedData.message);
    const s = bic.base64ToBigint(await parsedData.message) *bcu.modInv(r, (await keysCE).n);
    const v = (await keysCE).verify(s);
    console.log(bic.bigintToBase64(v));
    return 


    // const intent = (await keys).publicKey.toJsonString();
    // const nenB64 = bic.bigintToBase64((await keys).publicKey.n);
    // const j = sha.digest(intent);
    // console.log("PRUEBA: " +await j);
    // const m = (await keys).publicKey.n;
    // const msgBI = bic.base64ToBigint(await j);
    // console.log(msgBI);
    // const r = bcu.randBetween((await keys).publicKey.n - 1n)
    // const blindMsg = ((await keys).publicKey.encrypt(r)*msgBI)%((await keys).publicKey.n)
    // const bs = (await keys).privateKey.sign (blindMsg)
    // const s= bs * bcu.modInv(r, (await keys).publicKey.n)
    // const v = (await keys).publicKey.verify(s)
    // console.log(v)
    // const msb = bic.bigintToBase64(v);
    // console.log(msb);
    // return 
}

const keys = keyGen();
const keysCE = login();
const getCertificate = getCert(); 