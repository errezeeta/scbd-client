class Voto {

    public pubk_user: string;
    public pubK_user_signed: string;
    public vote_encrypted: string;
    public vote_signed: string;

    constructor(pubk_user: string, pubk_user_signed: string, vote_encrypted: string, vote_signed: string) {
        this.pubk_user = pubk_user,
        this.pubK_user_signed = pubk_user_signed,
        this.vote_encrypted = vote_encrypted,
        this.vote_signed = vote_signed
    }

    public getpubk_user(): string {
        return this.pubk_user;
    }

    public getpubk_user_signed(): string {
        return this.pubK_user_signed;
    }

    public getvote_encypted(): string {
        return this.vote_encrypted;
    }

    public getvote_signed(): string {
        return this.vote_signed;
    }

}

export default Voto;