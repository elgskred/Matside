// routes/index.js
var mysql = require('mysql');
var async = require("async");
var multer = require('multer');
var bodyParser = require('body-parser');
var functions = require('../functions/functions.js');
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
var recipeNames = ['kake1', 'kake2', 'kake3'];

exports.recipe = function(req, res) {
	console.log(req.body);
	var UID = req.body.name.slice(0, 4) + Date.now();
	async.parallel([async.apply(functions.insertRecipe, req.body, UID), async.apply(functions.insertIngredients, req.body, UID), async.apply(functions.insertKeywords, req.body, UID), async.apply(functions.insertPictures, req.body, UID)],
		function done(err, results) {
			if (err) {
				console.log(err);
			};
			console.log(results);
			res.send("ok");
		});
}

exports.search = function(req, res) {
  console.log(req.params.id);
	async.parallel([async.apply(functions.searchRecipe, req.params.id)],
		function done (err, results) {
			if (err) {
				console.log(err);
			};
			res.send(results);
		});
}

exports.recipes = function(req, res) {
  console.log(req.params.uid);
  async.parallel([async.apply(functions.searchRecipeByUID, req.params.uid), async.apply(functions.searchIngredientsByUID, req.params.uid)],
    function done (err, results) {
      if (err) {
        console.log(err);
      };
      res.send(results);
    });
}


exports.uploadHandler = function(req, res) {
	if (req.file && req.file.originalname) {
  		console.log(`Received file ${req.file.originalname}`);
	}
	res.send(req.file.path); //Sends the file path back to the user so the image can be associated with the correct recipe
}

