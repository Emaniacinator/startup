export class PageState{
    static HomePage = new PageState('HomePage');
    static OtherPage = new PageState('OtherPage');

    constructor(name){
        this.name = name;
    }
}