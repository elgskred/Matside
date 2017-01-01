// app.js
var express = require('express');
var reactViews = require('express-react-views');
var bodyParser = require('body-parser');
var async = require('async');
var mysql = require('mysql');
var sizeof = require('object-sizeof');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'matUser',
  password : 'mat',
  database : 'mat'
});

var app = express();

//app.set('views', __dirname + '/views');
app.set('view engine', 'js');
app.engine('js', reactViews.createEngine());

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(express.static(__dirname + '/public'));

var routes = require('./routes');

//Front page
app.get('/', routes.index);
//Submited recipe
app.post('/oppskrift', routes.oppskrift);
//Se oppskrifter
app.get('/list', routes.list);




var port = process.env.PORT || 3333;
app.listen(port, function () {
  console.log('Dynamic react example listening on port ' + port);
});