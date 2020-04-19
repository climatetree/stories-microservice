const storyModel = require('../models/story.model.server');

const createStory = (story, successCallback, failCallback) => {
    let model = new storyModel(story);
    model.save(function (err,res) {
        if (err) {
            failCallback(err);
        }
        model.on('es-indexed', function (error, result) {
            if (error) {
                failCallback(error);
            }
            successCallback(res);
        })
    })
};

const deleteStory=(storyID,successfulCallback,failCallback)=>{
    storyModel.findOneAndRemove({story_id:storyID},function(err,res){
        if(err)failCallback(err);
        successfulCallback(res);
    })
};

const updateStory=(storyId,newStory,successfulCallback,failCallback)=>{
    storyModel.findOneAndUpdate({story_id:storyId},newStory,{new:true,upsert:true},
                            function(err,res){
                                if(err)failCallback(err);
                                successfulCallback(res);
                            })
};

const findAllStories = (limit, page, successCallback, failCallback) =>
    storyModel.search({match_all: {}}, {
                          "from": (page - 1) * limit,
                          "size": limit
                      }
        , function (err, res) {
            if (err) {
                failCallback(err);
            }
            successCallback(res.hits.hits);
        });

const findStoryByStoryID =
    (storyID, successfulCallback, failCallback) =>
        storyModel.search({match: {story_id: storyID}},
                          function (err, res) {
                              if (err) {
                                  failCallback(err);
                              }
                              successfulCallback(res.hits.hits);
                          });

const findStoryByPlaceID = (placeID, limit, page, successfulCallback, failCallback) => {
    storyModel.search({
                          "bool": {
                              "must": {
                                  "match_all": {}
                              },
                              "filter": {
                                  "terms": {
                                      "place_ids": [placeID]
                                  }
                              }
                          }
                      }, {from: (page - 1) * limit, size: limit},
                      function (err, res) {
                          if (err) {
                              failCallback(err);
                          }
                          successfulCallback(res.hits.hits);
                      });
};

const findTopStories=(numberOfStories,successfulCallback,failCallback)=>{
    storyModel.search({match_all: {}}, {
        "size": numberOfStories,
        "sort" : [
            { "date" : {"order" : "desc"}}]
    },function(err,res){
        if(err)failCallback(err);
        successfulCallback(res.hits.hits);
    })
};

const findStoryByTitle=(title,limit,page,successfulCallback,failCallback)=>{
    storyModel.search({"match": {
            "story_title": {
                "query": title,
                "fuzziness": "3"
            }
        }},{from: (page - 1) * limit, size: limit},(err,res)=>{
        if(err)failCallback(err);
        successfulCallback(res.hits.hits);
    })
};

const findStoryByDescription=(desc,limit,page,successfulCallback,failCallback)=>{
    storyModel.search({"match": {
            "description": {
                "query": desc,
                "fuzziness": "3"
            }
        }},{from: (page - 1) * limit, size: limit},(err,res)=>{
        if(err)failCallback(err);
        successfulCallback(res.hits.hits);
    })
};

const findUnratedStories=(limit,page,successfulCallback,failCallback)=>{
    storyModel.search({match:{rating:0}},{from: (page - 1) * limit, size: limit},(err,res)=>{
        if(err)failCallback(err);
        successfulCallback(res.hits.hits);
    })
};

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


const getSortedFlagged=(numberOfStories,successCallback,failCallback)=>{
    storyModel.search({
                          "bool": {
                              "must": {
                                  "match_all": {}
                              },
                              filter:{
                                  script:{
                                      script:"doc.flagged_by_users.size()>0"
                                  }}
                          }
                      },{size:numberOfStories,
                          sort:{"_script":{type:"number",
                                  script:"doc.flagged_by_users.size()",
                                  order:"desc"}}}
                      ,(err,res)=>{
        if(err)failCallback(err);
        successCallback(res.hits.hits);
    })
};

const constructQuery=(condition)=>{
    let result={bool:{must:{},filter:{bool:{must:[]}}}};
    if(condition.story_title===undefined){
        result.bool.must.match_all={}
    }else{
        result.bool.must.match= {
            "story_title": {
                "query": condition.story_title
            }
        }
    }
    const reduceFunc=(accumulator, currentValue) => accumulator.concat(currentValue.toLowerCase().split(" "));

    if(condition.placeID!==undefined){
        result.bool.filter.bool.must.push({terms:{place_ids:condition.placeID}});
    }
    if(condition.solution!==undefined){
        result.bool.filter.bool.must.push({terms:{solution:condition.solution.reduce(reduceFunc,[])}});
    }
    if(condition.strategy!==undefined){
        result.bool.filter.bool.must.push({terms:{strategy:condition.strategy.reduce(reduceFunc,[])}});
    }
    if(condition.sector!==undefined){
        result.bool.filter.bool.must.push({terms:{sector:condition.sector.reduce(reduceFunc,[])}});
    }
    if(result.bool.filter.bool.must.length===0){
        delete result.bool.filter;
    }
    return result;
};

const advancedSearch=(condition,limit,page,successCallback,failCallback)=>{
    storyModel.search(constructQuery(condition), {from: (page - 1) * limit, size: limit},
                      function (err, res) {
                          if (err) {
                              failCallback(err);
                          }
                          successCallback(res.hits.hits);
                      });
};


const findStoryByUserID=(userID,limit,page,successCallback,failCallback)=>{
    storyModel.search({match:{user_id:userID}},{from: (page - 1) * limit, size: limit},(err,res)=>{
        if(err)failCallback(err);
        successCallback(res.hits.hits);
    })
};


const findStoryBySolution = (solution, limit, page, successfulCallback, failCallback) => {
    storyModel.search({
                          "bool": {
                              "must": {
                                  "match_all": {}
                              },
                              "filter": {
                                  "terms": {
                                      "solution": solution.toLowerCase().split(" ")
                                  }
                              }
                          }
                      }, {from: (page - 1) * limit, size: limit},
                      function (err, res) {
                          if (err) {
                              failCallback(err);
                          }
                          successfulCallback(res.hits.hits);
                      });
};
const findStoryBySector = (sector, limit, page, successfulCallback, failCallback) => {
    storyModel.search({
                          "bool": {
                              "must": {
                                  "match_all": {}
                              },
                              "filter": {
                                  "terms": {
                                      "sector": sector.toLowerCase().split(" ")
                                  }
                              }
                          }
                      }, {from: (page - 1) * limit, size: limit},
                      function (err, res) {
                          if (err) {
                              failCallback(err);
                          }
                          successfulCallback(res.hits.hits);
                      });
};
const findStoryByStrategy = (strategy, limit, page, successfulCallback, failCallback) => {
    storyModel.search({
                          "bool": {
                              "must": {
                                  "match_all": {}
                              },
                              "filter": {
                                  "terms": {
                                      "strategy": strategy.toLowerCase().split(" ")
                                  }
                              }
                          }
                      }, {from: (page - 1) * limit, size: limit},
                      function (err, res) {
                          if (err) {
                              failCallback(err);
                          }
                          successfulCallback(res.hits.hits);
                      });
};

module.exports = {
    createStory,
    findAllStories,
    findStoryByStoryID,
    findStoryByPlaceID,
    findStoryByTitle,
    findStoryBySector,
    findStoryBySolution,
    findStoryByStrategy,
    deleteStory,
    updateStory,
    findStoryByDescription,
    findTopStories,
    findUnratedStories,
    likeStory,
    unlikeStory,
    flagStory,
    unflagStory,
    getSortedFlagged,
    advancedSearch,
    findStoryByUserID
};
