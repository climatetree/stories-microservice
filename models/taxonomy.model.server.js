const mongoose = require('mongoose');
const taxonomySchema = require('../schemas/taxonomy.schema.server');
const taxonomyModel = mongoose.model('taxonomy',taxonomySchema,'taxonomy');
module.exports = taxonomyModel;
