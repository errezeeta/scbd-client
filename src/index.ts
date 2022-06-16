
import {generateKeys, RsaKeyPair, RsaPublicKey} from '@scbd/rsa';
import * as sha from 'object-sha';
import * as bic from 'bigint-conversion';
import * as bcu from 'bigint-crypto-utils';
import fetch from 'node-fetch';
import * as paillierBigint from 'paillier-bigint';
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
      console.log("MIS keys: "+ keysCE.toJsonString());
      return keysCE;
    }
    console.log(boolean);
}

async function getCert(keys: RsaKeyPair, keysCE: RsaPublicKey ): Promise <String> {
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
    console.log("S es: "+bic.bigintToBase64(s));
    const v = (await keysCE).verify(s);
    console.log(bic.bigintToBase64(v));
    return (bic.bigintToBase64(s));


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

async function sendVote(keys: RsaKeyPair, keysCE: RsaPublicKey, vote: string, pubK_user_signed: String) {
  const response = await fetch("http://localhost:3000/rsa/paillierkeys", {
      method: 'POST',
      headers: {'Content-Type': 'application/json',
    } 
    });
  const data = await response.json();
  const parsedData = await (JSON.parse(JSON.stringify(await data)));
  console.log("las keys son :" + bic.base64ToBigint(parsedData.g));
  const paillierkeys = new paillierBigint.PublicKey(bic.base64ToBigint(await parsedData.n), bic.base64ToBigint(await parsedData.g));
  const encrypted_vote = paillierkeys.encrypt(bic.base64ToBigint(vote));
  console.log("voto encriptau: "+ bic.bigintToBase64(encrypted_vote));
  const vote_hash = sha.digest(bic.bigintToBase64(encrypted_vote),'SHA-256');
  console.log("hash: "+await vote_hash);
  const signed_hash_vote= keys.privateKey.sign(bic.base64ToBigint(await vote_hash));
  console.log(await bic.bigintToBase64(signed_hash_vote))
  console.log("hash vote: "+(vote_hash));
  const json = {
		pubk_user_e: bic.bigintToBase64(keys.publicKey.e),
    pubk_user_n: bic.bigintToBase64(keys.publicKey.n),
    pubK_user_signed: (await pubK_user_signed),
    encrypt_pubks: bic.bigintToBase64(await encrypted_vote),
    sign_privc: bic.bigintToBase64(await signed_hash_vote)
	}

  console.log("el json es: "+JSON.stringify(json));
  const secondRes = await fetch("http://localhost:3000/rsa/vote", {
      method: 'POST',
      body: JSON.stringify(json),
      headers: {'Content-Type': 'application/json',
    } 
    });
  const finaldata = await secondRes.json();
  const parsedfinal = await (JSON.parse(JSON.stringify(await finaldata)));
  console.log( JSON.stringify(parsedfinal));
}

async function main() {
const keys = keyGen();
const keysCE = login();
const cert = getCert(await keys, await keysCE);
const vote = sendVote(await keys, await keysCE, "00010000", await cert);
}

main();