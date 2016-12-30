// app.js
var express = require('express');
var reactViews = require('express-react-views');

var app = express();

//app.set('views', __dirname + '/views');
app.set('view engine', 'js');
app.engine('js', reactViews.createEngine());

app.use(express.static(__dirname + '/public'));

var routes = require('./routes');

//app.get('/', routes.index);
app.get('/', function (req, res) {
  var initialState = {
    items: [
      'document your code',
      'drop the kids off at the pool',
      '</script><script>alert(666)</script>'
    ],
    text: ''
  };
  console.log("Get");
  res.render('Html', { data: initialState });
});

app.post('/oppskrift', function (req, res) {
	console.log("Received");
});





var port = process.env.PORT || 3333;
app.listen(port, function () {
  console.log('Dynamic react example listening on port ' + port);
});