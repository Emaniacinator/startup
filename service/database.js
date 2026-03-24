const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.username}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const database = client.db('main');
const userCollection = database.collection('users');
const gameCollection = database.collection('games');

// This will asynchronously test the connection and exit the process if it fails
(async function testConnection() {
    try {
        await db.command({ ping: 1 });
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

async function updateUserRemoveAuth(user) {
    await userCollection.updateOne({ username: user.username }, { $unset: { token: 1 } });
};

async function addGame(game) {
    await gameCollection.insertOne(game);
};

async function getSingleGame(gameId) {
    await gameCollection.findOne({gameId: gameId});
};

async function getAllGames(){
    await gameCollection.find();
};

async function getTopFiveGames(){
    await gameCollection.aggregate([
        {$sort: {averageScore : -1}},
        {$limit: 5}    
    ]);
};

async function getNewestGameAdditions(){
    await gameCollection.aggregate([
        {$sort: {gameId : -1}},
        {$limit: 5}
    ]);
};

async function updateGameWithReview(gameId, gameReview) {
    // Add the review
    await gameCollection.updateOne({gameId: gameId}, {$push: {gameReviews: gameReview}});
    //Find the average score
    const averagedReviewScores = await gameCollection.aggregate([
        {$match: {gameId: gameId}}, 
        {$project: { averagedScores: {$avg: "gameReviews.reviewScore"}}}
    ]);
    const safetyCheckedAverageScore = averagedReviewScores[0]?.averagedScores ?? -1;
    // Update the average score
    await gameCollection.updateOne({gameId: gameId}, {$set: {averageScore: safetyCheckedAverageScore}});
};

async function getGameReviews(gameId){
    await gameCollection.findOne({gameId: gameId}, {projection: {gameReviews: 1}});
};



module.exports = {
  getUserByUsername,
  getUserByAuthToken,
  addUser,
  updateUser,
  updateUserRemoveAuth,
  addGame,
  getSingleGame,
  getAllGames,
  getTopFiveGames,
  getNewestGameAdditions,
  updateGameWithReview,
  getGameReviews,
};