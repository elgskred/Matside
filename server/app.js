// app.js
var express = require('express');
var reactViews = require('express-react-views');
var bodyParser = require('body-parser');
var multer = require('multer');
var mysql = require('mysql');
var functions = require('./functions/handleDisconnect.js');

var app = express();
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function (req, file, cb) {
      // Mimetype stores the file type, set extensions according to filetype
      switch (file.mimetype) {
        case 'image/jpeg':
          ext = '.jpeg';
          break;
        case 'image/png':
          ext = '.png';
          break;
        case 'image/gif':
          ext = '.gif';
          break;
      }

      cb(null, file.originalname.slice(0, 4) + Date.now() + ext);
    }
  });
const upload = multer({storage: storage});
var connection = mysql.createConnection({
  host     : '192.168.10.50',
  user     : 'matUser',
  password : 'mat123',
  database : 'mat',
  port     : '3306'
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control");
  next();
});



app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

var routes = require('./routes');

//Submited recipe
app.post('/recipe', routes.recipe); //new recipes are uploaded to this route
app.get('/search/:id', routes.search); //All searches are requested on this route
app.get('/recipes/:uid', routes.recipes); //Individual recipes are requested on this route
app.post('/uploadHandler', upload.single('file'), function (req, res, next) {
    if (req.file && req.file.originalname) {
      console.log(`Received file ${req.file.originalname}`);
    } 

    res.send(req.file.path); // You can send any response to the user here
  }); //Images are uploaded to this route















functions.handleDisconnect();

// var port = process.env.PORT || 3333;
// app.listen(port, function () {
//   console.log('Dynamic react example listening on port ' + port);
// });

var server = app.listen(3333, function(){
  console.log('Listening on port 3000');
});