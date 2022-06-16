"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rsa_1 = require("@scbd/rsa");
const sha = __importStar(require("object-sha"));
const bic = __importStar(require("bigint-conversion"));
const bcu = __importStar(require("bigint-crypto-utils"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const paillierBigint = __importStar(require("paillier-bigint"));
const bitLength = 1024;
const user = "Messi";
const pass = "10";
async function keyGen() {
    const keyPair = await (0, rsa_1.generateKeys)(bitLength);
    return keyPair;
}
async function login() {
    var boolean = false;
    const response = await (0, node_fetch_1.default)("http://localhost:8080/rsa/login", {
        method: 'POST',
        body: JSON.stringify({
            username: user,
            password: pass,
        }),
        headers: { 'Content-Type': 'application/json',
        }
    });
    const data = await response.json();
    const parsedData = await (JSON.parse(JSON.stringify(data)));
    if (await parsedData.message === "login complete") {
        boolean = true;
        const secondRes = await (0, node_fetch_1.default)("http://localhost:8080/rsa/pubK_CE", {
            method: 'POST',
            body: JSON.stringify({
                username: user,
                password: pass,
            }),
            headers: { 'Content-Type': 'application/json',
            }
        });
        const res = await secondRes.json();
        const parsedKeys = await (JSON.parse(JSON.stringify(res)));
        const keysCE = new rsa_1.RsaPublicKey(bic.base64ToBigint(parsedKeys.e), bic.base64ToBigint(parsedKeys.n));
        return keysCE;
    }
    console.log(boolean);
}
async function getCert(keys, keysCE) {
    const intent = (await keys).publicKey.toJsonString();
    const j = sha.digest(intent);
    console.log("PRUEBA: " + await j);
    const msgBI = bic.base64ToBigint(await j);
    console.log(msgBI);
    const r = bcu.randBetween((await keys).publicKey.n - 1n);
    const blindMsg = msgBI * bcu.modPow(r, (await keysCE).e, (await keysCE).n);
    const blindMsgB64 = bic.bigintToBase64(blindMsg);
    const response = await (0, node_fetch_1.default)("http://localhost:8080/rsa/sign", {
        method: 'POST',
        body: JSON.stringify({
            message: blindMsgB64,
        }),
        headers: { 'Content-Type': 'application/json',
        }
    });
    const data = await response.json();
    const parsedData = await (JSON.parse(JSON.stringify(data)));
    console.log("La data dcuelta es: " + await parsedData.message);
    const s = bic.base64ToBigint(await parsedData.message) * bcu.modInv(r, (await keysCE).n);
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
async function sendVote(keys, keysCE, vote, pubK_user_signed) {
    const response = await (0, node_fetch_1.default)("http://localhost:3000/rsa/paillierkeys", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
        }
    });
    const data = await response.json();
    const parsedData = await (JSON.parse(JSON.stringify(await data)));
    console.log("las keys son :" + bic.base64ToBigint(parsedData.g));
    const paillierkeys = new paillierBigint.PublicKey(bic.base64ToBigint(await parsedData.n), bic.base64ToBigint(await parsedData.g));
    const encrypted_vote = paillierkeys.encrypt(bic.base64ToBigint(vote));
    const vote_hash = sha.digest(vote, 'SHA-256');
    const signed_hash_vote = keys.privateKey.sign(bic.base64ToBigint(await vote_hash));
    const json = {
        pubk_user_e: bic.bigintToBase64(keys.publicKey.e),
        pubk_user_n: bic.bigintToBase64(keys.publicKey.n),
        pubK_user_signed: (await pubK_user_signed),
        encrypt_pubks: bic.bigintToBase64(await encrypted_vote),
        sign_privc: bic.bigintToBase64(await signed_hash_vote)
    };
    console.log("el json es: " + JSON.stringify(json));
    const secondRes = await (0, node_fetch_1.default)("http://localhost:3000/rsa/vote", {
        method: 'POST',
        body: JSON.stringify(json),
        headers: { 'Content-Type': 'application/json',
        }
    });
    const finaldata = await secondRes.json();
    const parsedfinal = await (JSON.parse(JSON.stringify(await finaldata)));
}
async function main() {
    const keys = keyGen();
    const keysCE = login();
    const cert = getCert(await keys, await keysCE);
    const vote = sendVote(await keys, await keysCE, "000001", await cert);
}
main();
//# sourceMappingURL=index.js.map