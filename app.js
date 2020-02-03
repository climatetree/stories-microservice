const express = require('express');
const bodyParser = require('body-parser');// initialize our express app
const app = express();

let port = 1234;

const product = require('./routes/solutions.route'); // Imports routes for the products
const story = require('./routes/story.route');

//define middle layer
app.use('/solution', product);
app.use('/solution',story)

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

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

module.exports = app;

//launch server
app.listen(port,() => console.log(`Example app listening on port ${port}!`))