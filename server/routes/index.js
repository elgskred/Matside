// routes/index.js
var mysql = require('mysql');
var async = require("async");
var multer = require('multer');

const storage = multer.diskStorage({
    destination: './uploads/',
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
	var UID = req.body.name.slice(0, 4) + Date.now();
	async.parallel([async.apply(insertRecipe, req.body, UID), async.apply(insertIngredients, req.body, UID), async.apply(insertKeywords, req.body, UID), async.apply(insertPictures, req.body, UID)],
		function done(err, results) {
			if (err) {

			};
			console.log(results);
			res.send("ok");
		});
}

exports.uploadHandler = function(req, res) {
	if (req.file && req.file.originalname) {
  		console.log(`Received file ${req.file.originalname}`);
	}
	res.send(req.file.path); // You can send any response to the user here
}

function insertRecipe(body, UID, callback) {
	var Insert = 'Insert Into `recipes` (UID, recipeName, recipe, author) ';
	var Values = 'Values (?, ?, ?, ?)';
	var sql = Insert + Values;
	var inserts = [UID, body.name, body.recipe, body.author];
	sql = mysql.format(sql, inserts);
	connection.query(sql, function(err, rows, fields){
		if(!err){
			callback(null, "recipe OK");
		} else {
			callback(err);
		}
	});
};

function insertIngredients(body, UID, callback) {
	var Insert = 'Insert Into `ingredients` (UID, ingredient, amount) ';
	var Values = 'Values (?, ?, ?)';
	var sql = Insert + Values;
	console.log(body.ingredients);
	async.forEachOf(body.ingredients, function(element, i , inner_callback) {
		var inserts = [UID, element, body.amount[i]];
		var Innersql = mysql.format(sql, inserts);
		connection.query(Innersql, function(err, rows, fields){
			if(!err) {
				inner_callback(null);
			} else {
				inner_callback(err);
			}
		})
	}, function(err) {
		if (err) {

		} else {
			callback(null, "ingredients ok");
		};
	});
};

function insertKeywords(body, UID, callback) {
	var Insert = 'Insert Into `keywords` (UID, keyword) ';
	var Values = 'Values (?, ?)';
	var sql = Insert + Values;
	async.forEachOf(body.keywords, function(element, i , inner_callback) {
		var inserts = [UID, element];
		var Innersql = mysql.format(sql, inserts);
		connection.query(Innersql, function(err, rows, fields){
			if(!err) {
				inner_callback(null);
			} else {
				inner_callback(err);
			}
		})
	}, function(err) {
		if (err) {

		} else {
			callback(null, "keywords ok");
		};
	});
};

function insertPictures(body, UID, callback) {
	var Insert = 'Insert Into `pictures` (UID, imgPath) ';
	var Values = 'Values (?, ?)';
	var sql = Insert + Values;
	async.forEachOf(body.files, function(element, i , inner_callback) {
		var inserts = [UID, element];
		var Innersql = mysql.format(sql, inserts);
		connection.query(Innersql, function(err, rows, fields){
			if(!err) {
				inner_callback(null);
			} else {
				inner_callback(err);
			}
		})
	}, function(err) {
		if (err) {

		} else {
			callback(null, "pictures ok");
		};
	});
};