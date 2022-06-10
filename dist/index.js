"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const rsa_1 = require("@scbd/rsa");
const node_fetch_1 = __importDefault(require("node-fetch"));
const express_1 = require("express");
const bitLength = 1024;
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const keyPair = yield (0, rsa_1.generateKeys)(bitLength);
        const keyCE = yield (0, node_fetch_1.default)('http://localhost:8080/rsa/pubk_ce', {
            method: 'POST',
            body: JSON.stringify({
                username: 'admin',
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        console.log(yield express_1.response.json());
        const PORT = app_1.default.get('PORT');
        yield app_1.default.listen(PORT);
        console.log('Servidor abierto en: ', PORT);
        return keyPair;
    });
}
const keys = main();
exports.default = keys;
//# sourceMappingURL=index.js.map