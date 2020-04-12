const express = require('express');
const bodyParser = require('body-parser');// initialize our express app
const app = express();
const es=require('./db/elasticsearch');

app.use((req, res, next) => {
    const allowedOrigins = ['http://localhost:3000', ' https://climatetree.azurewebsites.net'];
    const origin = req.headers.origin;
    if(allowedOrigins.indexOf(origin) > -1){
        res.setHeader('Access-Control-Allow-Origin', origin);
    }

    res.header("Access-Control-Allow-Headers",
               "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods",
               "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//Todo: Causing {"message":"createError is not defined","error":{}} error when API hit. Uncomment after figuring out why
// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.json({
                 message: err.message,
                 error: err
             });
});

require('./db/db')();
es.connectES();
let storyService;
if(es.esClient===null){
    console.log("cannot connect to elasticsearch, using only mongodb instead.");
    storyService=require('./routes/story.route.server');
}else{
    storyService =require('./routes/es.story.route.server');
}

storyService(app);
module.exports = app;
