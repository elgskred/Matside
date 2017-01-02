// app.js
var express = require('express');
var reactViews = require('express-react-views');
var bodyParser = require('body-parser');

var app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

var routes = require('./routes');

//Submited recipe
app.post('/oppskrift', routes.oppskrift);





var port = process.env.PORT || 3333;
app.listen(port, function () {
  console.log('Dynamic react example listening on port ' + port);
});