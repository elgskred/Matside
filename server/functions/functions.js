var express        =         require("express");
var bodyParser     =         require("body-parser");
var async          =         require("async");
var fs             =         require('fs');
var app            =         express();
var mysql          =         require('mysql');
var sizeof         =         require('object-sizeof');
var pool = mysql.createPool({
  connectionLimit: 25,
  host     : '192.168.10.50',
  user     : 'matUser',
  password : 'mat123',
  database : 'mat',
  port     : '3306'
});

exports.insertRecipe = function (body, UID, callback) {
  console.log(body.name);
  var Insert = 'Insert Into `recipes` (UID, recipeName, recipe, author, shortDesc) ';
  var Values = 'Values (?, ?, ?, ?, ?)';
  var sql = Insert + Values;
  var inserts = [UID, body.name, body.recipe, body.author, body.desc];
  sql = mysql.format(sql, inserts);
  pool.getConnection(function(err, connection) {
    connection.query(sql, function(err, rows, fields){
      connection.release();
      if(!err){
        callback(null, "recipe OK");
      } else {
        callback(err);
      }
    });
  });
};

exports.insertIngredients = function(body, UID, callback) {
  var Insert = 'Insert Into `ingredients` (UID, ingredient, amount) ';
  var Values = 'Values (?, ?, ?)';
  var sql = Insert + Values;
  pool.getConnection(function(err, connection) {
    async.forEachOf(body.ingredients, function(element, i , inner_callback) {
      var inserts = [UID, element, body.amount[i]];
      var Innersql = mysql.format(sql, inserts);
      connection.query(Innersql, function(err, rows, fields){
        if(!err) {
          inner_callback(null);
        } else {
          inner_callback(err);
        }
      });
    }, function(err) {
      if (err) {

      } else {
        connection.release();
        callback(null, "ingredients ok");
      };
    });
  });
};

exports.insertKeywords = function(body, UID, callback) {
  var Insert = 'Insert Into `keywords` (UID, keyword) ';
  var Values = 'Values (?, ?)';
  var sql = Insert + Values;
  pool.getConnection(function(err, connection) {
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
        connection.release();
        callback(null, "keywords ok");
      };
    });
  });
};

exports.insertPictures = function(body, UID, callback) {
  var Insert = 'Insert Into `pictures` (UID, imgPath) ';
  var Values = 'Values (?, ?)';
  var sql = Insert + Values;
  pool.getConnection(function(err, connection) {
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
        connection.release();
        callback(null, "pictures ok");
      };
    });
  });
};

exports.searchRecipe = function(searchFor, callback) {
  var Select = 'Select recipes.UID, recipes.recipeName, recipes.recipe, recipes.shortDesc ';
  var From = 'From `recipes` ';
  var Where = 'Where recipes.recipeName Like ?'
  var inserts = '%' + searchFor + '%';
  var sql = Select + From + Where;
  sql = mysql.format(sql, inserts);
  pool.getConnection(function(err, connection) {
    connection.release();
    connection.query(sql, function (err, rows, fields) {
        if (!err) {
          callback(null, rows);
        } else {
    
        };
      });
  });
};

exports.searchRecipeByUID = function(searchFor, callback) {
  var Select = 'Select * ';
  var From = 'From `recipes` ';
  var Where = 'Where recipes.UID LIKE ?';
  var inserts = searchFor;
  var sql = Select + From + Where;
  sql = mysql.format(sql, inserts);
  pool.getConnection(function(err, connection) {
    connection.release();
    connection.query(sql, function (err, rows, fields) {
      if (!err) {
        callback(null, rows);
      } else {

      };
    });
  });
};

exports.searchIngredientsByUID = function(searchFor, callback) {
  var Select = 'Select * ';
  var From = 'From `ingredients` ';
  var Where = 'Where ingredients.UID LIKE ?';
  var inserts = searchFor;
  var sql = Select + From + Where;
  sql = mysql.format(sql, inserts);
  pool.getConnection(function(err, connection) {
    connection.release();
    connection.query(sql, function (err, rows, fields) {
      if (!err) {
        callback(null, rows);
      } else {

      };
    });
  });
};

exports.searchPictureByUID = function(searchFor, callback) {
  var Select = 'Select * ';
  var From = 'From `pictures` ';
  var Where = 'Where pictures.UID LIKE ?';
  var inserts = searchFor;
  var sql = Select + From + Where;
  sql = mysql.format(sql, inserts);
  pool.getConnection(function(err, connection) {
    connection.release();
    connection.query(sql, function (err, rows, fields) {
      if (!err) {
        callback(null, rows);
      } else {

      };
    });
  });
};

exports.searchPicturesByUID = function(searchFor, callback) {
  var t = [];
  pool.getConnection(function(err, connection) {
    var Select = 'Select * ';
    var From = 'From `pictures` ';
    var Where = 'Where pictures.UID LIKE ?';
    var sql = Select + From + Where;
    async.forEachOf(searchFor, function(element, i , inner_callback) {
      var inserts = element;
      var Innersql = mysql.format(sql, inserts);
      connection.query(Innersql, function(err, rows, fields){
        if(!err) {
          console.log(rows);
          t[i] = rows;
          inner_callback(null);
        } else {
          inner_callback(err);
        }
      })
    }, function(err) {
      if (err) {

      } else {
        connection.release();
        callback(null, t);
      };
    });
  });
};