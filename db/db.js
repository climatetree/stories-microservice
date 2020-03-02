/**
 * This file is used for connecting to MongoDB.
 */

module.exports = function () {
    const mongoose = require('mongoose'),Admin=mongoose.mongo.Admin;
    let mongoURL =process.env.MONGO_URL || 'localhost';
    let mongoPORT = process.env.MONGO_PORT|| '27017';
    let dev_db_url = `mongodb://${mongoURL}:${mongoPORT}/climateTree`;
    let mongoDB = process.env.MONGODB_URI || dev_db_url;
    mongoose.connect(mongoDB);
};

// module.exports = function () {
//     if(process.env.DOCKER_ENABLE_CI){
//         const mongoose = require('mongoose'),Admin=mongoose.mongo.Admin;
//         let mongoPORT = process.env.MONGO_PORT|| '10255';
//         let accountName=process.env.MONGO_ACCOUNT_NAME;
//         let databaseName='climateTree';
//         let key=process.env.MONGO_KEY;
//         const mongoUri = `mongodb://${accountName}:${key}@${accountName}.documents.azure.com:${mongoPORT}/${databaseName}?ssl=true`;
//         let mongoDB = process.env.MONGODB_URI || mongoUri;
//         mongoose.set('debug', true);
//         mongoose.connect(mongoDB,{useNewUrlParser: true});
//     } else{
//         const mongoose = require('mongoose'),Admin=mongoose.mongo.Admin;
//         let mongoURL =process.env.MONGO_URL || 'localhost';
//         let mongoPORT = process.env.MONGO_PORT|| '27017';
//         let dev_db_url = `mongodb://${mongoURL}:${mongoPORT}/climateTree`;
//         let connStr='mongodb://stories-mongodb:KKYmGrO8a2NUL6jGaawC3BPd0eM5YxRA8gVucNsCAcTikrfl0BQVaY1bqNcaslvYoHJQU9QmYqzcuw2c03hypQ==@stories-mongodb.documents.azure.com:10255/climateTree?ssl=true';
//         let mongoDB = process.env.MONGODB_URI || dev_db_url;
//         mongoose.set('debug', true);
//         mongoose.connect(connStr,{useNewUrlParser: true});
//     }
// };
