import * as paillierBigint from 'paillier-bigint';
import * as bic from 'bigint-conversion';


export class PaillierSys {

    public publicKey: paillierBigint.PublicKey;
    public privateKey: paillierBigint.PrivateKey;
    public count: bigint;

    constructor(pubk: paillierBigint.PublicKey, privk: paillierBigint.PrivateKey) {
        this.publicKey= pubk;
        this.privateKey= privk;
        this.count = 0n;
    }

}

export default PaillierSys;