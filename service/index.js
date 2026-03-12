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

apiRouter.post('/auth/logout', async (req, res) => {

  const userToLogout = getUserInformation('token', req.cookies['authorizationCookie']);

  if (!userToLogout){

    res.status(401).send({ msg: 'Can\'t log out a user that isn\'t logged in'});

  } else {

    res.clearCookie('authorizationCookie');
    res.status(204).end();
  };
});

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