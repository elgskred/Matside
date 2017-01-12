var express        =         require("express");
var bodyParser     =         require("body-parser");
var async          =         require("async");
var fs             =         require('fs');
var app            =         express();
var functions      =         require('../functions/handleDisconnect.js');
var mysql          =         require('mysql');
var sizeof         =         require('object-sizeof');
var connection = mysql.createConnection({
  host     : '192.168.10.50',
  user     : 'matUser',
  password : 'mat123',
  database : 'mat',
  port     : '3306'
});

functions.handleDisconnect();


exports.insertRecipe = function (body, UID, callback) {
  console.log(body.name);
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

exports.insertIngredients = function(body, UID, callback) {
  var Insert = 'Insert Into `ingredients` (UID, ingredient, amount) ';
  var Values = 'Values (?, ?, ?)';
  var sql = Insert + Values;
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

exports.insertKeywords = function(body, UID, callback) {
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

exports.insertPictures = function(body, UID, callback) {
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

exports.search = function(searchFor, callback) {
  var Select = 'Select recipes.UID, recipes.recipeName ';
  var From = 'From `recipes` ';
  var Where = 'Where recipes.recipeName Like ?'
  var inserts = '%' + searchFor + '%';
  var sql = Select + From + Where;
  sql = mysql.format(sql, inserts);
  connection.query(sql, function (err, rows, fields) {
    if (!err) {
      callback(null, rows);
    } else {

    };
  });
};