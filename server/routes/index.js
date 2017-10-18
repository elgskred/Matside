// routes/index.js
var mysql = require('mysql');
var async = require("async");
var multer = require('multer');
var bodyParser = require('body-parser');
var functions = require('../functions/functions.js');
var errLog = require('../functions/errorLogging.js');
var util = require('util');
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
var visitors = [];


exports.recipe = function(req, res) {
  //Adds a new recipe to the db
  var UID;
  //The table "recipes" holds the primary key, recipes are uploaded here first to get the UID.
  async.parallel([async.apply(functions.insertRecipe, req.body)],
    function done(err, results) {
      if (err) {
        errLog.writeToFile('Failed to insert recipe into table');
        errLog.writeToFile(err);
      } else {
        UID = results[0];
        errLog.writeToFile(util.format('UID: %d received', UID));
        console.log('UID: %d received', UID);
        //Uses the UID as foregin key in the other tables
        async.parallel([async.apply(functions.insertIngredients, req.body, UID), async.apply(functions.insertPictures, req.body, UID), async.apply(functions.insertKeywords, req.body, UID)],
          function done(err, results) {
            if (err) {
              errLog.writeToFile(err);
              console.log(err);
            } else {
              errLog.writeToFile(util.format("Recipe with UID: %d uploaded correctly", UID));
              console.log("Recipe with UID: %d uploaded correctly", UID);
            }
          });
      }
      res.send(util.format("Recipe with UID: %d uploaded correctly", UID));
    })
	
}

exports.search = function(req, res) {
  //Search for recipes based on name or ingredients
  console.log("search");
  var str = req.params.id;
  var includes = [];
  var excludes = [];
  var searchTerm = [];
  var searchSentence = "";
  var splitStr = str.split(' ');
  //Splits the search string. Elements preceeded by "+", "-", and " " gets sorted into their respective arrays
  //One array for includes, excludes, one for the entire search string(excluding +/- elements) and one array for each element in the search string
  async.forEachOf(splitStr, function(element, i , inner_callback) {
    if (element.match(/[+]/)){
      includes[includes.length] = element.replace(/[+]/, '');
      inner_callback(null);
    } else if (element.match(/[-]/)){
      excludes[excludes.length] = element.replace(/[-]/, '');
      inner_callback(null);
    } else {
      searchTerm[searchTerm.length] = element;
      searchSentence = searchSentence + " " + element;
      inner_callback(null);
    };
    }, function(err) {
      if (err) {
        errLog.writeToFile('Failed to split search strings');
        errLog.writeToFile(err);
      } else {
      };
    })
  //Runs the sql querys async.One for includes, excludes,"string", and "string" "elements".
	async.parallel([async.apply(functions.searchSentence, searchSentence.substring(1)), async.apply(functions.searchTerm, searchTerm), async.apply(functions.searchIncludes, includes), async.apply(functions.searchExcludes, excludes)],
		function done (err, results) {
			if (err) {
        errLog.writeToFile('Error while searching for recipes based on name or ingredients');
        errLog.writeToFile(err);
			};
      console.log("Results sendt to client");
			res.send(results);
		});
}

//Retrieves the recipes by looking for a specific UID
exports.recipes = function(req, res) {
  var v = req.connection.remoteAddress
  var uid = req.params.uid;
  var visitor = {ip: v, page: uid};
  var recordedVisit = false;
  var flag = false;
  //Increment the view counter if the IP is unique
  if (visitors.length == 0) {
    visitors.push(visitor);
    async.parallel([async.apply(functions.incrementViews,uid)], 
        function done (err, results) {
          if (err) {
            errLog.writeToFile('Failed to increment views');
            errLog.writeToFile(err);
            console.log(err);
          };
        });
  };
  async.forEachOf(visitors, function(element, i, inner_callback) {
    if (element.ip === v && element.page === uid) {
      recordedVisit = true;
      inner_callback(null);
    } else {
      inner_callback(null);
    }
  }, function(err) {
    if(err) {
      errLog.writeToFile('Failed to loop through unique visitors');
      errLog.writeToFile(err);
      console.log(err);
    } else {
      if (recordedVisit == false) {
        async.parallel([async.apply(functions.incrementViews,uid)], 
        function done (err, results) {
          if (err) {
            errLog.writeToFile('Failed to increment views');
            errLog.writeToFile(err);
            console.log(err);
          };
        });
        visitors.push(visitor);

      };
    }
  });
  //Gets the recipe, ingredients, images and keywords based on the requested UID
  console.log("Getting recipe with UID %d", uid);
  async.parallel([async.apply(functions.searchRecipeByUID, uid), async.apply(functions.searchIngredientsByUID, uid), async.apply(functions.searchPictureByUID, uid), async.apply(functions.searchKeywordsByUID, uid)],
    function done (err, results) {
      if (err) {
        errLog.writeToFile('Failed to retreive recipe with given UID');
        errLog.writeToFile(err);
        console.log(err);
      };
      console.log("Results for UID: %d retreived", uid);
      res.send(results);
    });
}

//Handles the uploading of images
exports.uploadHandler = function(req, res) {
	if (req.file && req.file.originalname) {
  		console.log(`Received file ${req.file.originalname}`);
	}
	res.send(req.file.path); //Sends the file path back to the user so the image can be associated with the correct recipe
}

//Finds the images tied  to a specific UID
exports.searchImg = function(req, res) {
  var temp = [];
  console.log("Get images with UID: %d", req.body.UID);
  async.parallel([async.apply(functions.searchPicturesByUID, req.body.UID)],
    function done (err, results) {
      if (err) {
        errLog.writeToFile('Failed to find images tied  to specific UID');
        errLog.writeToFile(err);
        console.log(err);
      };
      console.log("Retreived images with UID: %d", req.body.UID);
      res.send(results[0]);
    });
}

//Returns the current top 5 popular recipes
exports.popularRecipes = function(req, res) {
  async.parallel([async.apply(functions.getPopularRecipes)],
    function done (err, results) {
      if (err) {
        errLog.writeToFile('Failed to find popular recipes');
        errLog.writeToFile(err);
        console.log(err);
      }
      console.log("Get popular recipes");
      res.send(results[0]);
    })
}

//Updates a recipe with a given UID
exports.updateRecipe = function(req, res) {
  console.log("Update recipe with UID: %d", req.body.UID);
  async.parallel([async.apply(functions.updateRecipe, req.body), async.apply(functions.updateIngredients, req.body), async.apply(functions.updateImages, req.body), async.apply(functions.updateKeywords, req.body)],
    function done (err, results) {
      if (err) {
        errLog.writeToFile('Failed to update recipe');
        errLog.writeToFile(err);
        console.log(err);
      }
      console.log(results);
    })
  res.send("ok");
}


