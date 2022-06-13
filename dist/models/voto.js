"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Voto {
    constructor(pubk_user, pubk_user_signed, vote_encrypted, vote_signed) {
        this.pubk_user = pubk_user,
            this.pubK_user_signed = pubk_user_signed,
            this.vote_encrypted = vote_encrypted,
            this.vote_signed = vote_signed;
    }
    getpubk_user() {
        return this.pubk_user;
    }
    getpubk_user_signed() {
        return this.pubK_user_signed;
    }
    getvote_encypted() {
        return this.vote_encrypted;
    }
    getvote_signed() {
        return this.vote_signed;
    }
}
exports.default = Voto;
//# sourceMappingURL=voto.js.map