var elasticsearch=require('elasticsearch');
var storyModel=require('../models/story.model.server');
var esClient=null;

const storyIndexInit=async ()=>{
    await esClient.indices.delete({
                              index: 'storys'
                          }, function(err, res) {

        if (err) {
            console.error(err.message);
        } else {
            console.log('Index storys has been deleted!');
        }
    });
    var stream = storyModel.synchronize(), count = 0;
    stream.on('data', function(err, doc){
        count++;
    });
    stream.on('close', function(){
        console.log('indexed ' + count + ' documents!');
    });
    stream.on('error', function(err){
        console.log(err);
    });
};

var connectES=async ()=>{
    const remoteAddress="https://climatetree-elasticsearch.azurewebsites.net/";
    const connObj={};
    if(process.env.DOCKER_ENABLE_CI){
        connObj.host=remoteAddress;
    }
    esClient= await new elasticsearch.Client(connObj);
    await esClient.ping({
                    // ping usually has a 3000ms timeout
                    requestTimeout: 3000
                }, function (error) {
        if (error) {
            console.trace('elasticsearch ping failed!');
            esClient=null;
        } else {
            console.log('ES connected successfully');
            storyIndexInit();
        }
    });
};

module.exports={esClient,connectES};