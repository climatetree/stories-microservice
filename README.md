
# stories-microservice
[![Build Status](https://travis-ci.com/climatetree/backend-mongo.svg?branch=develop)](https://travis-ci.com/climatetree/backend-mongo)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=com.climatetree%3Astories-microservice&metric=alert_status)](https://sonarcloud.io/dashboard?id=com.climatetree%3Astories-microservice)

## Project Structure
https://tinyurl.com/uesvbo4
## APIs for now
1. GET /stories -> findAllStories
2. GET /stories/story/:storyID -> findStoryByStoryID
3. POST /stories/create -> createStory
4. DELETE /stories/:storyId -> deleteStory
5. PUT /stories/:storyId -> updateStory
6. GET /stories/place/:placeID -> findStoryByPlaceID

## APIs in progress
## APIs to do


## Local node and mongodb setup:
### MongoDB local setup:
1.	Download and install mongoDB from https://www.mongodb.com/
2.	(Not very sure if this is needed) MongoDB needs a directory to store data, typically located at the root.
    a.	mkdir /data
    b.	mkdir /data/db
    c.	On mac OS you may need to run with sudo
3.	From command line use ‘mongod’ to start the server(for mac you may need ‘sudo mongod’)
4.	Mongod server listens to port 27017

### Test if mongodb is working:
1.	On command line, use ‘mongo’ to connect to database server.
2.	In the mongodb command line you can use ‘show dbs’ to print all the available databases. You should have a database called ‘admin’

### Add dummy data to mongoDB:
•	Access the readme from https://drive.google.com/drive/u/1/folders/1m4AmKM9RY42YPohglCSAWJLnXo9pYzdr. Run the python script by following the instructions on the readme.md from the above link.

•	Run the ‘show dbs’ command and you should see the climateTree database available

### Node Setup:
1.	Install node from https://nodejs.org/
2.	Clone the repo with ‘git clone https://github.com/climatetree/backend-mongo.git’
3.	Navigate into the cloned folder. Install express with “npm install express –save” on the command line
4.	Run the command ‘npm start’ to run the application. 

### Test node setup:
1.	Open a web browser, type the URL as “http://localhost:3000/stories”. If you get data returned to you, your local setup is good to go.
