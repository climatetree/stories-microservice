/**
 * This file is used for connecting to MongoDB.
 */

module.exports = function () {
    const mongoose = require('mongoose'),Admin=mongoose.mongo.Admin;
    let dev_db_url = 'mongodb://localhost:27017/climateTree';
    let mongoDB = process.env.MONGODB_URI || dev_db_url;
    mongoose.connect(mongoDB);
  };
  