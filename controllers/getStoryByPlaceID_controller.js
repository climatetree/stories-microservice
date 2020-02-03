/**
 * This file is for API: getStoryByID, used by story.route.js and use story.model.js
 * Param: placeID
 * Return: Stories queried by placeID
 * @type {*}
 */

const model=require('../models/story.model');


//use testDB for now.
exports.getStoryByPlaceID=function (req,res) {
    model.getStoryByPlaceID(req.params.placeID).exec(function (err,stories) {
      res.send(JSON.stringify(stories, null, '\t'))
    });
};