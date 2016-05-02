
# Amazon Fine Food Recommendation

## Data
The data of Amazon fine food reviews is downloaded from Kaggle : https://www.kaggle.com/snap/amazon-fine-food-reviews

## Purpose
The purpose of this mini project includes:
* Fetch data from Sqlite database.
* Use Collaborative Filtering Algorithm to build recommendation for active users.
* Store the recommendations in Elasticsearch.

## Data Analysis Process
### Raw Data
Raw data contains **568454** reviews of **74258** food products by **256059** users.

### Data Exploratory
Considering calculation performance, only 'useful reviews' by 'active users' are used for data exploratory.
Definition of 'useful review': review that has been marked as 'helpful'.
Definition of 'active user': user who have wrote reviews for more than **20** products. The total number of 'active user' is **1703**.
And we will only build recommendations for these active users.

### Models & Algorithms
Many libraries offer Collaborative Filtering Algorithm implementation. The library likely.js is tried first. And it uses matrix factorization. When the row or column gets more than 1,000 elements, the program will run out of memory. So raccoon.js is implemented finally. It works fine for 10,000 of training reocords using Redis. Here are basic features of the algorithm:
  * Jaccard Coefficient for Similarity
  * K-Nearest Neighbors Algorithm for Recommendations
  * Wilson Score Confidence Interval for a Bernoulli Parameter

### Result
Recommendations for all active users are saved in Elasticsearch.

## Libraries Used
The libraries used in the project include:
* sqlite3: for reading from Sqlite database;
* raccoon: for building recommendations with Collaborative Filtering Algorithm
* elasticsearch: for writing to Elasticsearch database;
