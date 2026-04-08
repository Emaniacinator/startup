const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');
const url = `mongodb://Emaniacinator:${config.password}@ac-p796oz2-shard-00-00.ymjcfqu.mongodb.net:27017,ac-p796oz2-shard-00-01.ymjcfqu.mongodb.net:27017,ac-p796oz2-shard-00-02.ymjcfqu.mongodb.net:27017/?ssl=true&replicaSet=atlas-iarrw0-shard-0&authSource=admin&appName=VideoGameVotingWebsite`;

const client = new MongoClient(url);

async function main() {
  console.log('Attempting connection...');
  await client.connect();
  console.log('Connected successfully!');
  await client.close();
}

main().catch(console.error);