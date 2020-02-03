/**
 * This file is used for connecting MongoDB and query data.
 */

// Set up mongoose connection
const mongoose = require('mongoose'),Admin=mongoose.mongo.Admin;
let dev_db_url = 'mongodb://localhost:27017/';
let mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
let db = mongoose.connection;
allDatabases=null;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.on('open',function () {
    new Admin(db.db).listDatabases(function(err, result) {
        console.log('listDatabases succeeded');
        // database list stored in result.databases
        allDatabases = result.databases;
    });
});

//Return all databases
exports.testDB=function(){
    return allDatabases;
};