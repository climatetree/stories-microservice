const storyModel = require('../models/story.model.server');
const ObjectID = require("bson-objectid");

findAllStories = (limit, page) => storyModel.find().skip((page-1)*limit).limit(limit);

findTopStories = (numberOfStories) => storyModel.find().sort({date: 'desc'}).limit(parseInt(numberOfStories));

findStoryByStoryID = storyID => storyModel.findOne({story_id: storyID});

findStoryByUserID = (userID, limit, page) => storyModel.find({user_id:{$eq:userID}}).skip((page-1)*limit).limit(limit);

findStoryByPlaceID = (placeID, limit, page) => storyModel.find({place_ids:{$elemMatch:{$eq:placeID}}}).skip((page-1)*limit).limit(limit);

findStoryBySolution = (solution_name, limit, page) => storyModel.find({solution:{$elemMatch:{$eq:solution_name}}}).skip((page-1)*limit).limit(limit);

findStoryBySector = (sector_name, limit, page) => storyModel.find({sector: {$elemMatch:{$eq:sector_name}}}).skip((page-1)*limit).limit(limit);

findStoryByStrategy = (strategy_name, limit, page) => storyModel.find({strategy:{$elemMatch:{$eq:strategy_name}}}).skip((page-1)*limit).limit(limit);

findStoryByTitle = (title, limit, page) => storyModel.find({story_title:{$regex: title,$options:'i'}}).skip((page-1)*limit).limit(limit);

findUnratedStories = (limit, page) => storyModel.find({rating: 0}).sort({date: 'desc'}).skip((page-1)*limit).limit(limit);

findStoryByDescription=(desc,limit,page)=>storyModel.find( {description:{$regex:desc,$options:'i'}}).skip((page-1)*limit).limit(limit);

createStory = story => {
    story.story_id=ObjectID().str;
    return storyModel.create(story);
};

deleteStory = (storyId) => storyModel.deleteOne({story_id: storyId});

updateStory = (storyID, story) => storyModel.findOneAndUpdate({story_id: storyID}, {$set: story}, {new: true});

const likeStory = (story, userID) => {
    if(!story.liked_by_users.includes(userID)){
        story.liked_by_users.push(userID);
        return story;
    } 
        return story;
    
};

const unlikeStory = (story, userID) => {
    for(let i=0; i<story.liked_by_users.length; i++){
        if(story.liked_by_users[i] === userID){
            story.liked_by_users.splice(i, 1);
            return story;
        }
    }
    return null;
};

const flagStory = (story, userID) => {
    if(!story.flagged_by_users.includes(userID)){
        story.flagged_by_users.push(userID);
        return story;
    }
    return story;

};

const unflagStory = (story, userID) => {
    for(let i=0; i<story.flagged_by_users.length; i++){
        if(story.flagged_by_users[i] === userID){
            story.flagged_by_users.splice(i, 1);
            return story;
        }
    }
    return null;
};
// const getSortedFlagged = (numberOfStories) =>
//     storyModel.find({ $where: "this.flagged_by_users.length > 0" }).sort({flagged_by_users: 'desc'}).limit(parseInt(numberOfStories));
const getSortedFlagged = (numberOfStories) =>
    storyModel.aggregate([
        {$unwind: "$flagged_by_users"},
        {$group: {"_id": "$_id","story_id":  { "$first": "$story_id" }, answers: {$push:"$flagged_by_users"}, size: {$sum:1}}},
        {$sort:{size:-1}}]).limit(parseInt(numberOfStories));

const constructQuery=(condition)=>{
    let result={};
    if(condition.story_title!==undefined){
        result['story_title']={$regex: condition.story_title,$options:'i'}
    }
    if(condition.placeID!==undefined){
        result["place_ids"]={"$in":condition.placeID};
    }
    if(condition.solution!==undefined){
        result["solution"]={"$in":condition.solution};
    }
    if(condition.strategy!==undefined){
        result["strategy"]={"$in":condition.strategy};
    }
    if(condition.sector!==undefined){
        result["sector"]={"$in":condition.sector};
    }
};

const advancedSearch=(condition,limit,page)=>storyModel.find(constructQuery(condition)).skip((page-1)*limit).limit(limit);

module.exports = {
    findAllStories,
    findStoryByStoryID,
    findStoryByPlaceID,
    findStoryByUserID,
    findStoryByTitle,
    findStoryByDescription,
    findStoryBySector,
    findStoryBySolution,
    findStoryByStrategy,
    findTopStories,
    findUnratedStories,
    createStory,
    deleteStory,
    updateStory,
    likeStory,
    unlikeStory,
    flagStory,
    unflagStory,
    getSortedFlagged,
    advancedSearch
};
