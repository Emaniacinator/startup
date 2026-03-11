import { Game } from './classes/game';

const express = require('express');
const app = express();
const cookeParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');

const port = process.argv.length > 2 ? process.argv[2] : 3000;

let temporaryUsernameStorage = [];
let temporaryPasscodeStorage = [];
let temporaryGameListStorage = [];
let temporaryNewGameList = [];

app.use(express.json());

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

let apiRouter = express.Router();
app.use('/api', apiRouter);

apiRouter.post('/auth/create', async (req, res) => {
    
});