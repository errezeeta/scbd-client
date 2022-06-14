"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sumNumber = void 0;
const index_1 = require("../index");
async function sumNumber(m) {
    const encrypted_sum = (await index_1.paillierSys).publicKey.addition(m, (await index_1.paillierSys).count);
    (await index_1.paillierSys).count = encrypted_sum;
    return (await index_1.paillierSys).count;
}
exports.sumNumber = sumNumber;
//# sourceMappingURL=paillier.controller.js.map