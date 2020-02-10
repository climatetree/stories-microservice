/**
 * This file is used for connecting to MongoDB.
 */

module.exports = function () {
    if(process.env.CI){
        const mongoose = require('mongoose'),Admin=mongoose.mongo.Admin;
        let mongoPORT = process.env.MONGO_PORT|| '10255';
        let accountName='stories-mongodb';
        let databaseName='climateTree';
        let key='KKYmGrO8a2NUL6jGaawC3BPd0eM5YxRA8gVucNsCAcTikrfl0BQVaY1bqNcaslvYoHJQU9QmYqzcuw2c03hypQ==';
        const mongoUri = `mongodb://${accountName}:${key}@${accountName}.documents.azure.com:${mongoPORT}/${databaseName}?ssl=true`;
        let mongoDB = process.env.MONGODB_URI || mongoUri;
        mongoose.set('debug', true);
        mongoose.connect(mongoDB,{useNewUrlParser: true});
    } else{
        const mongoose = require('mongoose'),Admin=mongoose.mongo.Admin;
        let mongoURL =process.env.MONGO_URL || 'localhost';
        let mongoPORT = process.env.MONGO_PORT|| '27017';
        let dev_db_url = `mongodb://${mongoURL}:${mongoPORT}/climateTree`;
        let mongoDB = process.env.MONGODB_URI || dev_db_url;
        mongoose.connect(mongoDB);
    }
};
  