//Libraries
var sqlite = require('sqlite3'),
    Recommender = require('likely');

//Declare variables
var inputMatrix = [];
var labelCount = 0;
var rowLabels = [];
var userMap = {};
var colLabels = [];
var productMap = {};
var db = new sqlite.Database('data/database.sqlite');

//Retrieve data from database
function getDataFromDb(sqlText, callback){
  var dataResult = [];
  db.each(sqlText, function (err, row) {
    dataResult.push(row);
  }, function (err, count){
    callback(err, dataResult);
  });
}

function buildRecommendation(){
  //Initialize input matrix, set all value as 0.
  for(var r = 0; r < rowLabels.length; r++){
    var sparseArray = [];
    for(var c = 0; c < colLabels.length; c++){
      sparseArray.push(0);
    }
    inputMatrix.push(sparseArray);
  }
  //update input matrix with scores
  getDataFromDb('select UserId, ProductId, Score from training_reviews order by UserId, ProductId',
    function (err, result) {
      for( var a = 0; a < result.length; a++){
        var user = result[a].UserId;
        var product = result[a].ProductId;
        var score = result[a].Score;
        inputMatrix[userMap[user]][productMap[product]] = score;
      }
      console.log(inputMatrix.length, rowLabels.length, colLabels.length);

      //build recommendaion model
      var model = Recommender.buildModel(inputMatrix, rowLabels, colLabels);
      var recommendations = model.recommendations(process.argv[2]);
      for( var l = 0; l < recommendations.length; l++){
        console.log(recommendations[l]);
      }
    });

}

//set row labels
getDataFromDb('select distinct UserId from training_reviews order by UserId', function (err, result) {
  rowLabels = result.map(function (u) { return u.UserId; });
  //Initialize user map
  for(var i = 0; i < rowLabels.length; i++){
    userMap[rowLabels[i]] = i;
  }
  //if row lables & column labels both completed, create input matrix
  labelCount++;
  if( labelCount === 2){
    buildRecommendation();
  }
});

//set column labels
getDataFromDb('select distinct ProductId from training_reviews order by ProductId', function (err, result) {
  colLabels = result.map(function (u) { return u.ProductId; });
  //Initalize product map
  for(var j = 0; j < colLabels.length; j++){
    productMap[colLabels[j]] = j;
  }
  labelCount++;
  //if row lables & column labels both completed, create input matrix
  if( labelCount === 2){
    buildRecommendation();
  }
});
