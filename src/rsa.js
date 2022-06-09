const bcu = require('bigint-crypto-utils')
const bc = require('bigint-conversion')

class RsaPrivateKey {
  constructor (d, n) {
    this.d = d
    this.n = n
  }

  decrypt (c) {
    return bcu.modPow(c, this.d, this.n)
  }

  sign (m) {
    return bcu.modPow(m, this.d, this.n)
  }

  toJsonString () {
    return JSON.stringify({
      d: bc.bigintToHex(this.d),
      n: bc.bigintToHex(this.n)
    })
  }
}

function rsaPrivateKeyFromJson (jsonStr) {
  const keyPair = JSON.parse(jsonStr)
  return new RsaPrivateKey(bc.hexToBigint(keyPair.d), bc.hexToBigint(keyPair.n))
}

class RsaPublicKey {
  constructor (e, n) {
    this.e = e
    this.n = n
  }

  encrypt (m) {
    return bcu.modPow(m, this.e, this.n)
  }

  verify (s) {
    return bcu.modPow(s, this.e, this.n)
  }

  blindSign (m) {
    const nonce = bcu.randBetween(this.n - 1n)
    console.log(nonce)
    const ms = m * nonce
    const res = '' + ms + ',' + nonce
    console.log(res)
    return res
  }

  toJsonString () {
    return JSON.stringify({
      e: bc.bigintToHex(this.e),
      n: bc.bigintToHex(this.n)
    })
  }
}

function rsaPublicKeyFromJson (jsonStr) {
  const keyPair = JSON.parse(jsonStr)
  return new RsaPublicKey(bc.hexToBigint(keyPair.e), bc.hexToBigint(keyPair.n))
}

class rsaKeyPair {
  constructor (publicKey, privateKey) {
    this.publicKey = publicKey
    this.privateKey = privateKey
  }
}
const generateKeys = async function (bitLength) {
  const e = 65537n
  let p = 0n; let q = 0n; let n = 0n; let phi = 0n
  do {
    p = await bcu.prime(bitLength / 2 + 1)
    q = await bcu.prime(bitLength / 2)
    n = p * q
    phi = (p - 1n) * (q - 1n)
  } while (bcu.bitLength(n) !== bitLength || (phi % e === 0n) || q === p)

  const publicKey = new RsaPublicKey(e, n)

  const d = bcu.modInv(e, phi)

  const privKey = new RsaPrivateKey(d, n)

  const keys = {
    privateKey: privKey,
    publicKey
  }

  return keys
}

module.exports = {
  rsaKeyPair,
  RsaPublicKey,
  RsaPrivateKey,
  generateKeys,
  rsaPrivateKeyFromJson,
  rsaPublicKeyFromJson
}
