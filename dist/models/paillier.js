"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaillierSys = void 0;
class PaillierSys {
    constructor(pubk, privk) {
        this.publicKey = pubk;
        this.privateKey = privk;
        this.count = 0n;
    }
}
exports.PaillierSys = PaillierSys;
exports.default = PaillierSys;
//# sourceMappingURL=paillier.js.map