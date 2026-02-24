export class LoginState {
    static LoggedIn = new LoginState('LoggedIn');
    static LoggedOut = new LoginState('LoggedOut');

    constructor(name){
        this.name = name;
    }
}