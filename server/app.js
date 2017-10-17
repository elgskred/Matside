// app.js
var express = require('express');
var reactViews = require('express-react-views');
var bodyParser = require('body-parser');
var multer = require('multer');
var mysql = require('mysql');
var routes = require('./routes');

var app = express();
const storage = multer.diskStorage({
    destination: '../client/public/uploads/',
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

app.post('/recipe', routes.recipe); //new recipes are uploaded to this route
app.post('/updateRecipe', routes.updateRecipe);
app.get('/search/:id', routes.search); //All searches are requested on this route
app.post('/searchImg', routes.searchImg);//
app.get('/popularRecipes', routes.popularRecipes);//Gets the top 5 popular recipes
app.get('/recipes/:uid', routes.recipes); //Individual recipes are requested on this route
app.get('/recipes/:uid/edit', routes.recipes); //Enables editing of a specified recipe
app.post('/uploadHandler', upload.single('file'), function (req, res, next) {
    if (req.file && req.file.originalname) {
      console.log(`Received file ${req.file.originalname}`);
    } 
    console.log(req.file);
    res.send(req.file.filename); // You can send any response to the user here
  }); //Images are uploaded to this route


var port = process.env.PORT || 3333;
app.listen(port, function () {
  console.log('Dynamic react example listening on port ' + port);
});