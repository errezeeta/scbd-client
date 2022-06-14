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
exports.checkVote = exports.signMsg = exports.getServerPubK = exports.generateBothKeys = void 0;
const rsa_1 = require("@scbd/rsa");
const sha = __importStar(require("object-sha"));
const bic = __importStar(require("bigint-conversion"));
const paillier = __importStar(require("./paillier.controller"));
const data_1 = __importDefault(require("../data"));
const index_1 = require("../index");
const index_2 = require("../index");
const voto_1 = __importDefault(require("../models/voto"));
const bitLength = 1024;
async function generateBothKeys(req, res) {
    const keyPair = await (0, rsa_1.generateKeys)(bitLength);
    const key = {
        e: bic.bigintToBase64(keyPair.publicKey.e),
        n: bic.bigintToBase64(keyPair.publicKey.n)
    };
    return res.status(201).json(key);
}
exports.generateBothKeys = generateBothKeys;
async function getServerPubK(req, res) {
    //añadir condicion login
    console.log(req.body);
    const username = req.body;
    const check = data_1.default.find((obj) => {
        return obj.username === username.username;
    });
    //Si no encontramos el usuario en la lista (archivo data.ts), le denegaremos el acceso a la clave
    if (check === undefined) {
        const error = {
            message: "You are not authorized"
        };
        return res.status(401).json(error);
    }
    else {
        const key = {
            e: bic.bigintToBase64(await (await index_1.keys).publicKey.e),
            n: bic.bigintToBase64(await (await index_1.keys).publicKey.n)
        };
        return res.status(201).json(key);
    }
}
exports.getServerPubK = getServerPubK;
async function signMsg(req, res) {
    const msg = req.body;
    const privKey = await (await index_1.keys).privateKey;
    const signed = await bic.bigintToBase64(privKey.sign(msg));
    return res.status(201).json({ signature: signed });
}
exports.signMsg = signMsg;
async function checkVote(req, res) {
    const msg = (JSON.parse(JSON.stringify(req.body)));
    const pubk_user = new rsa_1.RsaPublicKey(msg.pubk_user_e, msg.pubk_user_n);
    const vote = new voto_1.default(pubk_user, msg.pubK_user_signed, msg.vote_encrypted, msg.vote_signed);
    //Verifico la firma viendo si coincide con el resumen de la clave publica del usuario
    const resumen_firma = (await index_2.pubk_ce).verify(msg.pubK_user_signed);
    const resumen_clave = bic.textToBigint(await sha.digest(vote.pubk_user.e));
    if (resumen_firma === resumen_clave) {
        //Verifico el voto viendo si coincide la firma del resumen del voto encriptado con el resumen del voto encriptau
        const resumen_firma_voto = vote.pubk_user.verify(bic.textToBigint(vote.vote_signed));
        const resumen_voto = bic.textToBigint(await sha.digest(vote.vote_encrypted));
        if (resumen_firma_voto === resumen_voto) {
            //El voto es legítimo y vamos a efectuar paillier
            paillier.sumNumber(bic.textToBigint(vote.vote_encrypted));
            return res.status(201).json({
                message: "Vote correcly realized"
            });
        }
        else {
            const error = {
                message: "You are not authorized"
            };
            return res.status(401).json(error);
        }
    }
    else {
        const error = {
            message: "You are not authorized"
        };
        return res.status(401).json(error);
    }
}
exports.checkVote = checkVote;
//# sourceMappingURL=rsa.controller.js.map