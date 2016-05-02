
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
Raw data contains **568,454** reviews of **74,258** food products by **256,059** users.

### Data Exploratory
Considering calculation performance, only 'useful reviews' by 'active users' are used for data exploratory.
Definition of 'useful review': review that has been marked as 'helpful'.
Definition of 'active user': user who has written reviews for more than **20** products. The total number of 'active user' is **1,703**.
And we will only build recommendations for these active users.

### Models & Algorithms
Many libraries offer Collaborative Filtering Algorithm implementation. At first, the library likely.js is tried first. And it uses matrix factorization. When the row or column gets more than 1,000 elements, the program will run out of memory. And then raccoon.js is implemented. It works fine for 10,000 of training records using Redis. Here are basic features of the algorithm:
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
