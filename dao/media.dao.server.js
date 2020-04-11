const mediaTypeModel = require('../models/media.model.server');


getAllMediaTypes = () => mediaTypeModel.find()


module.exports = {
    getAllMediaTypes
}