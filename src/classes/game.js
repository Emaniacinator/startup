export class Game{

    gameReviews = []; 
    allGameScores = [];
    averageScore = 0;

    constructor(gameName, gameImageUrl, gameSummary, gameId){
        this.gameName = gameName;
        this.gameImageUrl = gameImageUrl;
        this.gameSummary = gameSummary;
        this.gameId = gameId;
    }

    returnGameName(){
        return this.gameName
    }
}