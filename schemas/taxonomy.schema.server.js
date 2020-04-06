const mongoose = require('mongoose');

const taxonomySchema = mongoose.Schema({
    strategy:String,
    sector:String,
    solution:String});

module.exports = taxonomySchema;
