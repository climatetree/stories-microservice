/**
 * This file is used for connecting to MongoDB.
 */

// module.exports = function () {
//     const mongoose = require('mongoose'),Admin=mongoose.mongo.Admin;
//     let mongoURL =process.env.MONGO_URL || 'localhost';
//     let mongoPORT = process.env.MONGO_PORT|| '27017';
//     let dev_db_url = `mongodb://${mongoURL}:${mongoPORT}/climateTree`;
//     let mongoDB = process.env.MONGODB_URI || dev_db_url;
//     mongoose.connect(mongoDB);
// };

module.exports = function () {
    const mongoose = require('mongoose'),Admin=mongoose.mongo.Admin;
    const mongoPORT = process.env.MONGO_PORT|| '10255';
    const accountName=process.env.MONGO_ACCOUNT_NAME ||'stories-mongodb';
    const databaseName='climateTree';
    const key=process.env.MONGO_KEY||'KKYmGrO8a2NUL6jGaawC3BPd0eM5YxRA8gVucNsCAcTikrfl0BQVaY1bqNcaslvYoHJQU9QmYqzcuw2c03hypQ==';
    const mongoUri = `mongodb://${accountName}:${key}@${accountName}.documents.azure.com:${mongoPORT}/${databaseName}?ssl=true`;
    const mongoDB = process.env.MONGODB_URI || mongoUri;
    mongoose.set('debug', true);
    mongoose.connect(mongoDB,{useNewUrlParser: true});
};
