//Libraries
var sqlite = require('sqlite3'),
    raccoon = require('raccoon'),
    elasticsearch = require('elasticsearch');

//Connect to Sqlite
var db = new sqlite.Database('data/database.sqlite');

//Connect to redis server, before running this program redis server should be started.
raccoon.config.className = 'food';
raccoon.connect(6379, '127.0.0.1');
raccoon.flush();

//Connect to elasticsearch, before running this program elasticsearch server should be started.
var client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});

//declare variables
var count = 0;
var numOfTasks = 0;
var countOfBuild = 0;
var numOfTasksBuild = 0;

function buildComplete(){
  countOfBuild++;

  if(countOfBuild === numOfTasksBuild){
    process.exit(0);
  }
}

function buildRecommendation(){
  numOfTasksBuild++;
  //Fetch active users and do recommendations for them
  db.each('select distinct UserId from training_reviews', function (err, row) {
    numOfTasksBuild++;
    raccoon.recommendFor(row.UserId, 5, function (results) {
      //create json object
      var params = {
        index: 'affindex',     //amazon fine food index
        type: 'afftype',       //amazon fine food type
        id: row.UserId,        //unique id
        body: {
          recommendations: results//recommendation
        }
      }
      //create elasticsearch object
      numOfTasksBuild++;
      client.create(params, function (err, response) {
        buildComplete();
      });
      buildComplete();
    });
  }, buildComplete
  );
}

function taskComplete(){
  count++;
  if(count === numOfTasks){
    console.log('before calling Recommender');
    buildRecommendation();
  }
}

//Set liked training data for the model
numOfTasks++;
db.each('select UserId, ProductId from training_reviews where Score >= 3', function (err, row) {
  numOfTasks++;
  raccoon.liked(row.UserId, row.ProductId, taskComplete);
}, taskComplete);

//Set disliked training data for the model
numOfTasks++;
db.each('select UserId, ProductId from training_reviews where Score < 3', function (err, row) {
  numOfTasks++;
  raccoon.disliked(row.UserId, row.ProductId, taskComplete);
}, taskComplete);
