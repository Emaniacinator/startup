const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const DATABASE = require('./database.js');

const port = process.argv.length > 2 ? process.argv[2] : 4000;

let twitchAuth;
const twitchClientId = 'oe6w8v1vae6tu8884zgmlbugswk1eh';
const twitchClientSecret = '9nsgc0s558wrq5tx7pbe52mwqh8v3d';

app.use(cors({
  origin: ['http://localhost:5173', 'https://api.igdb.com/', 'https://id.twitch.tv/', 'http://localhost:4000'],
  credentials: true
}))

app.use(express.json());

app.use(cookieParser());

app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

let apiRouter = express.Router();
app.use('/api', apiRouter);

// The following are weird wrapper endpoints because twitch's apis really don't
// like the stadard call methods when they come from a webpage so I have to do
// the calls from frontend to here to twitch apparently for the igdb database
apiRouter.post('/igdbDatabase/getAuthorization', async (req, res) => {
  let body = new URLSearchParams({
      client_id: twitchClientId,
      client_secret: twitchClientSecret,
      grant_type: 'client_credentials'
  });

  let credentialHelper = async () => {

    console.log('Trying to get twitch auth');

    const twitchResponse = await fetch('https://id.twitch.tv/oauth2/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString()
    });

    console.log(`Got twitch auth: ${twitchResponse}`);

    const jsonifiedResponse = await twitchResponse.json();
    twitchAuth = jsonifiedResponse.access_token;

  };

  await credentialHelper();
  res.send({ msg: 'Authorization successful' });

});

apiRouter.post('/igdbDatabase/checkIfGameIsReal', async (req, res) => {
  let requestBody = `fields id, name; search "${req.body.gameName}"; limit 1;`;

  try{

      const response = await fetch('https://api.igdb.com/v4/search', {
          method: 'POST',
          headers: {
              'Client-ID': twitchClientId,
              'Authorization': `Bearer ${twitchAuth}`,
          },
          body: requestBody
      });

      if (response.status === 401){
          throw new Error('Error with Twitch API access token');
      }
      else if (!response.ok){
          throw new Error('Error in the Twitch IGDB API');
      }

      let responseData = await response.json();

      if (responseData.length > 0){
          res.send(true);
      } else {
          res.send(false);
      }
  }
  catch (error) {
      res.status(401).send({msg: "Error finding game:" + error});
  }
})

// The following are the authorization endpoints
apiRouter.post('/auth/create', async (req, res) => {

  console.log('Calling create User')

  if (await getUserInformation('username', req.body.username)){
    console.log('Found a user with the same username')
    res.status(409).send({ msg: 'User already exists, please pick a different username'});
  } else {
    console.log('Creating user in databases')
    const createdUser = await createNewUser(req.body.username, req.body.passcode);
    console.log('Setting authorization cookies')
    updateAuthorizationCookies(res, createdUser);
    console.log(`Returning the username: ${createdUser.username}`)
    res.send({ username: createdUser.username });
  };

});

apiRouter.post('/auth/login', async (req, res) => {

  let userToLogin = await getUserInformation('username', req.body.username);

  if (!userToLogin){
    res.status(404).send({ msg: 'That user doesn\'t exist in our database'});
  } else {

    if (!(await bcrypt.compare(req.body.passcode, userToLogin.passcode))){
      res.status(401).send({ msg: 'Invalid passcode'});
    } else {
      userToLogin.authToken = uuid.v4();
      await updateAuthorizationCookies(res, userToLogin);
      res.send({ username: userToLogin.username });
    };

  };

});

apiRouter.delete('/auth/logout', async (req, res) => {

  const userToLogout = await getUserInformation('authToken', req.cookies['authorizationCookie']);

  if (!userToLogout){
    res.status(401).send({ msg: 'Can\'t log out a user that isn\'t logged in'});
  } else {
    await DATABASE.removeUserAuth(userToLogout);
    res.clearCookie('authorizationCookie');
    res.status(204).end();
  };

});

// The following are endpoints for getting and creating game info

// This function is for when the user creates a new game and sends it here
// Note that the user needs to be logged in to do this
apiRouter.post('/gameApi/createGame', verifyLogin, async (req, res) => {
  await createNewGame(req.body.gameName, req.body.gameImageUrl, req.body.gameSummary, req.body.gameId, req.body.averageScore);
  const gameList = await DATABASE.getAllGames();
  const newGameList = await DATABASE.getNewestGameAdditions();
  res.send({gameList, newGameList});
});

// This is a version of the above code that doesn't need auth as a way to have dummy users make games
apiRouter.post('/gameApi/createDummyGame', async (req, res) => {
  await createNewGame(req.body.gameName, req.body.gameImageUrl, req.body.gameSummary, req.body.gameId, req.body.averageScore);
  const gameList = await DATABASE.getAllGames();
  const newGameList = await DATABASE.getNewestGameAdditions();
  res.send({gameList, newGameList});
});

// This function is for when the user wants to get info on a specific game to load it's associated page
// Note that the user DOES NOT need to be logged in to do this
apiRouter.post('/gameApi/getGameInfo', async (req, res) => {

  const gameDataToGet = await getGameInformation('gameId', req.body.gameId);

  if (!gameDataToGet){
    res.status(404).send({ msg: 'That game could not be found in our database. Please consider adding it'});
  } else {
    res.send(gameDataToGet);
  };

});

// This function is just to check to see if a game is already in the database or not, based on its name
apiRouter.post('/gameApi/checkGameExists', async (req, res) => {

  const gameDataCheck = await getGameInformation('gameName', req.body.gameName);

  if(!gameDataCheck){
    res.send(false);
  } else {
    res.send(true);
  };

});

// This function gets all the different game lists needed for an application
apiRouter.post('/gameApi/getGameLists', async (req, res) => {

  const gameList = await DATABASE.getAllGames();
  const newGameList = await DATABASE.getNewestGameAdditions();
  const topFiveGameList = await DATABASE.getTopFiveGames();
  
  res.send( {
    gameList: gameList,
    newGameList: newGameList,
    topFiveGameList: topFiveGameList
  });
});

// This function is to leave a review of a game
apiRouter.post('/gameApi/addGameReview', verifyLogin, async (req, res) => {

  await DATABASE.updateGameWithReview(req.body.gameId, req.body.gameReview);

  res.status(200).send();
});

// This function is a temporary function to let a dummy leave a review of the game
apiRouter.post('/gameApi/addDummyGameReview', async (req, res) => {

    const gameReviewList = await DATABASE.updateGameWithReview(req.body.gameId, req.body.gameReview);

    res.status(200).send();
});

// The following are functions needed for checks and information
async function verifyLogin(req, res, next){

  const userToVerify = await getUserInformation('authToken', req.cookies['authorizationCookie']);

  if (!userToVerify){
    console.log("Failed the internal authorization");
    res.status(401).send({ msg: 'Not logged in, can\'t perform action'});
  } else {
    next();
  };
};

async function getUserInformation(elementToSearchThrough, valueToSearchFor) {

  if (!elementToSearchThrough){
    return null;
  };

  if (elementToSearchThrough === 'username'){
    return await DATABASE.getUserByUsername(valueToSearchFor);
  } else {
    return await DATABASE.getUserByAuthToken(valueToSearchFor);
  };
};

async function createNewUser(username, passcode) {

  const hashedPasscode = await bcrypt.hash(passcode, 15);

  let newUser = {
    username: username,
    passcode: hashedPasscode,
    authToken: uuid.v4(),
  };

  await DATABASE.addUser(newUser);

  return newUser;
};

async function updateAuthorizationCookies(res, userToAuthenticate){

  await DATABASE.updateUser(userToAuthenticate);

  res.cookie('authorizationCookie', userToAuthenticate.authToken, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 3600000
  });
};

async function createNewGame(gameName, gameImageUrl, gameSummary, gameId, averageScore){

  const gameToAdd = {
    gameName: gameName,
    gameImageUrl: gameImageUrl,
    gameSummary: gameSummary,
    gameId: gameId,
    averageScore: averageScore
  };

  await DATABASE.addGame(gameToAdd);
};

async function getGameInformation(fieldToSearchBy, itemToSearchFor){

  console.log(`Looking for the following item: ${itemToSearchFor} by searching through the following flags: ${fieldToSearchBy}`);

  if (!itemToSearchFor){
    return null;
  };

  if (fieldToSearchBy === 'gameId'){
    console.log(`Found the game ${JSON.stringify((await DATABASE.getSingleGameById(itemToSearchFor)), null, 2)}`);
    return await DATABASE.getSingleGameById(itemToSearchFor);
  } else {
    console.log(`Found the game ${JSON.stringify((await DATABASE.getSingleGameByName(itemToSearchFor)), null, 2)}`);
    return await DATABASE.getSingleGameByName(itemToSearchFor);
  };
};