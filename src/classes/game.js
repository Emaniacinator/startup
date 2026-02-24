export class Game{

    gameReviews = []; 
    allGameScores = [];
    averageScore = 0;
    releaseDate = "";

    // The averageScore and releaseDate items are for testing and dummy data use only
    constructor(gameName, gameImageUrl, gameSummary, gameId, averageScore = 0, releaseDate = ""){
        this.gameName = gameName;
        this.gameImageUrl = gameImageUrl;
        this.gameSummary = gameSummary;
        this.gameId = gameId;
        this.averageScore = averageScore;
        this.releaseDate = releaseDate;
    }

    returnGameName(){
        return this.gameName
    }

    returnAverageGameScore(){
        return this.averageScore
    }

    returnReleaseDate(){
        return this.releaseDate
    }

}