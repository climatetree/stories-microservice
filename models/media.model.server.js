const mongoose = require('mongoose');
const mediaSchema = require('../schemas/media.schema.server');
const mediaTypeModel = mongoose.model('media_type',mediaSchema,'media_type');
module.exports = mediaTypeModel;