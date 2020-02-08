/**
 * This file is used for connecting to MongoDB.
 */

module.exports = function () {
    const mongoose = require('mongoose'),Admin=mongoose.mongo.Admin;
    let mongoPORT = process.env.MONGO_PORT|| '10255';
    let accountName='stories-mongodb';
    let databaseName='climateTree';
    let key='KKYmGrO8a2NUL6jGaawC3BPd0eM5YxRA8gVucNsCAcTikrfl0BQVaY1bqNcaslvYoHJQU9QmYqzcuw2c03hypQ==';
    const mongoUri = `mongodb://${accountName}:${key}@${accountName}.documents.azure.com:${mongoPORT}/${databaseName}?ssl=true`;
    let mongoDB = process.env.MONGODB_URI || mongoUri;
    mongoose.set('debug', true);
    mongoose.connect(mongoDB,{useNewUrlParser: true});
  };
  