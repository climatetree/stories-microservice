/**
 * This file is used for connecting to MongoDB.
 */

module.exports = function () {
    const mongoose = require('mongoose');
    const mongoPORT = '10255';
    const accountName='stories-mongodb';
    const databaseName='climateTree';
    const key='KKYmGrO8a2NUL6jGaawC3BPd0eM5YxRA8gVucNsCAcTikrfl0BQVaY1bqNcaslvYoHJQU9QmYqzcuw2c03hypQ==';
    const mongoUri = `mongodb://${accountName}:${key}@${accountName}.documents.azure.com:${mongoPORT}/${databaseName}?ssl=true`;
    mongoose.set('debug', true);
    mongoose.connect(mongoUri,{useNewUrlParser: true});
  };
  