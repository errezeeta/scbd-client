class User {

    public username: string;
    public password: string;

    constructor(username: string, password: string) {
        this.username= username;
        this.password= password;
    }

    public getUsername(): string {
        return this.username;
    }

    public getPassword(): string {
        return this.password;
    }
}

export default User;