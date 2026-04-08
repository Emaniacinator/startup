const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

const url = `mongodb://Emaniacinator:${config.password}@ac-p796oz2-shard-00-00.ymjcfqu.mongodb.net:27017,ac-p796oz2-shard-00-01.ymjcfqu.mongodb.net:27017,ac-p796oz2-shard-00-02.ymjcfqu.mongodb.net:27017/?ssl=true&replicaSet=atlas-iarrw0-shard-0&authSource=admin&appName=VideoGameVotingWebsite`;

const client = new MongoClient(url);
const database = client.db('main');
const userCollection = database.collection('users');
const gameCollection = database.collection('games');

// This will asynchronously test the connection and exit the process if it fails
(async function testConnection() {
    try {
        await database.command({ ping: 1 });
        console.log(`Connect to database`);
    } catch (ex) {
        console.log(`Unable to connect to database with ${url} because ${ex.message}`);
        process.exit(1);
    }
})();

function getUserByUsername(username) {
    return userCollection.findOne({ username: username });
};

function getUserByAuthToken(authToken) {
    return userCollection.findOne({ authToken: authToken });
};

async function addUser(user) {
    await userCollection.insertOne(user);
};

async function updateUser(user) {
    await userCollection.updateOne({ username: user.username }, { $set: user });
};

async function removeUserAuth(user) {
    await userCollection.updateOne({ username: user.username }, { $unset: { authToken: 1 } });
};

async function addGame(game) {
    await gameCollection.insertOne(game);
};

async function getSingleGameById(gameId) {
    return gameCollection.findOne({gameId: gameId});
};

async function getSingleGameByName(gameName) {
    return gameCollection.findOne({gameName: gameName});
};

async function getAllGames(){
    return gameCollection.find().toArray();
};

async function getTopFiveGames(){
    return gameCollection.aggregate([
        {$sort: {averageScore : -1}},
        {$limit: 5}    
    ]).toArray();
};

async function getNewestGameAdditions(){
    return gameCollection.aggregate([
        {$sort: {gameId : -1}},
        {$limit: 5}
    ]).toArray();
};

async function updateGameWithReview(gameId, gameReview) {
    // Add the review
    await gameCollection.updateOne({gameId: gameId}, {$push: {gameReviews: gameReview}});
    //Find the average score
    const averagedReviewScores = await gameCollection.aggregate([
        {$match: {gameId: gameId}}, 
        {$project: { averagedScores: {$avg: "$gameReviews.reviewScore"}}}
    ]).toArray();

    console.log("Aggregation result:", JSON.stringify(averagedReviewScores, null, 2));
    
    const safetyCheckedAverageScore = averagedReviewScores[0]?.averagedScores ?? -1;
    // Update the average score
    await gameCollection.updateOne({gameId: gameId}, {$set: {averageScore: safetyCheckedAverageScore}});
};


module.exports = {
  getUserByUsername,
  getUserByAuthToken,
  addUser,
  updateUser,
  removeUserAuth,
  addGame,
  getSingleGameById,
  getSingleGameByName,
  getAllGames,
  getTopFiveGames,
  getNewestGameAdditions,
  updateGameWithReview
};