// app.js
var express = require('express');
var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'jsx');
app.engine('jsx', require('express-react-views').createEngine());

var routes = require('./routes');

app.get('/', routes.index);

var server = app.listen(3000, function(){
	console.log('Listening on port 3000');
});