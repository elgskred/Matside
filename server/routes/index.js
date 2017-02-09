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
  var str = req.params.id;
  var includes = [];
  var excludes = [];
  var searchTerm = [];
  var searchSentence = "";
  var splitStr = str.split(' ');
  async.forEachOf(splitStr, function(element, i , inner_callback) {
    if (element.match(/[+]/)){
      includes[includes.length] = element.replace(/[+]/, '');
      inner_callback(null);
    } else if (element.match(/[-]/)){
      excludes[excludes.length] = element.replace(/[-]/, '');
      inner_callback(null);
    } else {
      searchTerm[searchTerm.length] = element;
      searchSentence = searchSentence + element;
      searchSentence = searchSentence + " ";
      inner_callback(null);
    };
    }, function(err) {
      if (err) {

      } else {
      };
    })
	async.parallel([async.apply(functions.searchRecipe, searchTerm, includes, excludes, searchSentence)],
		function done (err, results) {
			if (err) {
				console.log(err);
			};
			res.send(results);
		});
}

exports.recipes = function(req, res) {
  console.log(req.params.uid);
  async.parallel([async.apply(functions.searchRecipeByUID, req.params.uid), async.apply(functions.searchIngredientsByUID, req.params.uid), async.apply(functions.searchPictureByUID, req.params.uid)],
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

exports.searchImg = function(req, res) {
  var temp = [];
  async.parallel([async.apply(functions.searchPicturesByUID, req.body.UID)],
    function done (err, results) {
      if (err) {
        console.log(err);
      };
      res.send(results[0]);
    });
}

