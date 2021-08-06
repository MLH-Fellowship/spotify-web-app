class Auth {
    constructor() {
        this.authenticated = false;
        this.token = '';
    }
    
    login(callback){
        this.authenticated = true;
        callback();
    }
    logout(callback){
        this.authenticated = false;
        this.token = '';
        callback();
    }

    isAuthenticated(){
        console.log(this.authenticated);
        return this.authenticated;
    }

    getToken(){
        return this.token;
    }
    setToken(token){
        this.token = token;
    }
}

export default new Auth();