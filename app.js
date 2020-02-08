const express = require('express');
const bodyParser = require('body-parser');// initialize our express app
const app = express();

//set port number
let port = 1234;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//Todo: Causing {"message":"createError is not defined","error":{}} error when API hit. Uncomment after figuring out why
// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler
app.use(function(err, req, res, next) {
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

require('./db/db')()

const storyService = require('./routes/story.route.server')
storyService(app)

//launch server
app.listen(port,() => console.log(`Example app listening on port ${port}!`))

module.exports = app;
