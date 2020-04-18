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
    if(process.env.DOCKER_ENABLE_CI){
        const mongoose = require('mongoose');
        const mongoUri = process.env.MONGO_URL;
        mongoose.set('debug', true);
        mongoose.connect(mongoUri,{useNewUrlParser: true});
    } else{
        const mongoose = require('mongoose'),Admin=mongoose.mongo.Admin;
        const mongoURL =process.env.MONGO_URL || 'localhost';
        const mongoPORT = process.env.MONGO_PORT|| '27017';
        const dev_db_url = `mongodb://${mongoURL}:${mongoPORT}/climateTree`;
        mongoose.set('debug', true);
        //mongoose.connect(dev_db_url,{useNewUrlParser: true});
    }
};
