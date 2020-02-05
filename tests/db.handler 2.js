const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const mongodb = new MongoMemoryServer();

/**
 * connecting to the in-memory database
 */
module.exports.connect = async() => {
    const uri = await mongodb.getConnectionString();

    const mongooseOpts = {
        useNewUrlParser: true
    }

    try{
        await mongoose.connect(uri, mongooseOpts);
        console.log(`MongoDb Connected on: ${uri}`);
    } catch (error) {
        console.log('Error to connect on mongo', error);
    }
}

/**
 * dropping the database, close connection and stop mongodb
 */
module.exports.closeDatabase = async() => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongodb.stop();
}

/**
 * remove data from the database (from all the collections in mongo db)
 */
module.exports.clearDatabase = async() => {
    const collections= mongoose.connection.collections;

    for(const index in collections) {
        const collection = collections[index];
        await collection.deleteMany();
    }
}