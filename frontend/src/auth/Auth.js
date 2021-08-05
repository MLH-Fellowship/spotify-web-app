class Auth {
    constructor() {
        this.authenticated = false;
        this.token = '';
    }
    
    login(callback){
        this.authenticated = true;
        this.token = localStorage.getItem('token');
        callback();
    }
    logout(callback){
        this.authenticated = false;
        this.token = '';
        localStorage.removeItem('token');
        callback();
    }

    isAuthenticated(){
        if (localStorage.getItem('token') !== null && localStorage.getItem('token') !== undefined){
            this.authenticated = true;
        }
        else{
            this.authenticated = false;
        }
        return this.authenticated;
    }

    getToken(){
        if (localStorage.getItem('token') !== null && localStorage.getItem('token') !== undefined){
            this.token = localStorage.getItem('token');
        }
        else{
            this.token = '';
        }
        return this.token;
    }
}

export default new Auth();