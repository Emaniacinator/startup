export class PageState{
    static HomePage = new PageState('HomePage');
    static GamePage = new PageState('GamePage');
    static AddGamePage = new PageState('AddGamePage');
    static LoginPage = new PageState('LoginPage');
    static OtherPage = new PageState('OtherPage');

    constructor(name){
        this.name = name;
    }
}