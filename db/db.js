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
  