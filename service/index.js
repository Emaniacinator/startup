import { Game } from './classes/game';

const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');

const port = process.argv.length > 2 ? process.argv[2] : 3000;

let temporaryUserInfoStorage = [];
let temporaryGameListStorage = [];
let temporaryNewGameList = [];

app.use(express.json());

app.use(cookieParser());

app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

let apiRouter = express.Router();
app.use('/api', apiRouter);

// The following are the authorization endpoints
apiRouter.post('/auth/create', async (req, res) => {

  if (await getUserInformation('username', req.body.username)){
    res.status(409).send({ msg: 'User already exists, please pick a different username'});
  } else {
    const createdUser = await createNewUser(req.body.username, req.body.passcode);
    updateAuthorizationCookies(res, createdUser.authToken);
    res.send({ username: createdUser.username });
  };

});

apiRouter.post('/auth/login', async (req, res) => {

  const userToLogin = await getUserInformation('username', req.body.username);

  if (!userToLogin){
    res.status(401).send({ msg: 'That user doesn\'t exist in our database'});
  } else {

    if (!(await bcrypt.compare(req.body.passcode, userToLogin.passcode))){
      res.status(401).send({ msg: 'Invalid passcode'});
    } else {
      userToLogin.authToken = uuid.v4();
      updateAuthorizationCookies(res, userToLogin.authToken);
      res.send({ username: userToLogin.username });
    };

  };

});

apiRouter.delete('/auth/logout', async (req, res) => {

  const userToLogout = getUserInformation('authToken', req.cookies['authorizationCookie']);

  if (!userToLogout){
    res.status(401).send({ msg: 'Can\'t log out a user that isn\'t logged in'});
  } else {
    res.clearCookie('authorizationCookie');
    res.status(204).end();
  };

});

// The following are endpoints for getting and creating game info

// This function is for when the user creates a new game and sends it here
// Note that the user needs to be logged in to do this

// THIS WON'T WORK YET BECAUSE YOU HAVEN'T FORMATTED THE GAME CORRECTLY IN THE BACKEND REACT CODE
apiRouter.post('/gameApi/createGame', verifyLogin, async (req, res) => {
  await createNewGame(req.body.gameName, req.body.gameImageUrl, req.body.gameSummary, req.body.gameId, req.body.averageScore);
  res.send(temporaryGameListStorage, temporaryNewGameList); // This maybe shouldn't be here and should be a whole endpoint but for now we're just going to see what happens
});

// This function is for when the user wants to get info on a specific game to load it's associated page
// Note that the user DOES NOT need to be logged in to do this
apiRouter.post('/gameApi/getGameInfo', async (req, res) => {

  const gameDataToGet = getGameInformation('gameId', req.body.gameId);

  if (!gameDataToGet){
    res.status(404).send({ msg: 'That game could not be found in our database. Please consider adding it'});
  } else {
    res.send(gameDataToGet);
  };

});

// This function is just to check to see if a game is already in the database or not, based on its name
apiRouter.post('/gameApi/checkGameExists', async (req, res) => {

  const gameDataCheck = getGameInformation('gameName', req.body.gameName);

  if(!gameDataCheck){
    res.send(false);
  } else {
    res.send(true);
  };

});

// The following are functions needed for checks and information
async function verifyLogin(req, res, next){

  const userToVerify = await getUserInformation('authToken', req.cookies['authorizationCookie']);

  if (!userToVerify){
    res.status(401).send({ msg: 'Not logged in, can\'t perform action'});
  } else {
    next();
  };

};

async function getUserInformation(elementToSearchThrough, valueToSearchFor) {

  if (!elementToSearchThrough){
    return null;
  };

  return temporaryUserInfoStorage.find((currentItem) => currentItem[elementToSearchThrough] === valueToSearchFor);

};

async function createNewUser(username, passcode) {

  const hashedPasscode = await bcrypt.hash(passcode, 15);

  let newUser = {
    username: username,
    passcode: passcode,
    authToken: uuid.v4(),
  };

  temporaryUserInfoStorage.push(newUser);

  return newUser;

};

function updateAuthorizationCookies(res, authToken){

  res.cookie('authorizationCookie', authToken, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 30000
  });

};

async function createNewGame(gameName, gameImageUrl, gameSummary, gameId, averageScore){

  const gameToAdd = {
    gameName: gameName,
    gameImageUrl: gameImageUrl,
    gameSummary: gameSummary,
    gameId: gameId,
    averageScore: averageScore
  }

  temporaryGameListStorage.push(gameToAdd);

  if (temporaryNewGameList.length > 4){
      temporaryNewGameList.shift();
  }

  temporaryNewGameList.push(gameToAdd)

};

async function getGameInformation(fieldToSearchBy, itemToSearchFor){

  if (!itemToSearchFor){
    return null;
  };

  return getGameInformation.find((currentItem) => currentItem[fieldToSearchBy] === itemToSearchFor);
  
}