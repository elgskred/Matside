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

exports.insertRecipe = function (body, callback) {
  var Insert = 'Insert Into `recipes` (recipeName, recipeDescription, shortDescription) ';
  var Values = 'Values (?, ?, ?)';
  var sql = Insert + Values;
  var inserts = [body.name, body.recipe, body.desc];
  sql = mysql.format(sql, inserts);
  pool.getConnection(function(err, connection) {
    connection.query(sql, function(err, rows, fields){
      if(!err){
        connection.release();
        callback(null, rows.insertId);
      } else {
        callback(err);
      }
    });
  });
};

exports.insertIngredients = function(body, UID, callback) {
  var Insert = 'Insert Into `ingredients` (UID, ingredient_name, ingredient_amount) ';
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
  var Insert = 'Insert Into `pictures` (UID, imagePath) ';
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

exports.searchSentence = function(searchSentence, callback) {
  if (searchSentence.length > 0){
    var Select = 'Select recipes.UID, recipes.recipeName, recipes.recipeDescription, recipes.shortDescription ';
    var From = 'From `recipes` ';
    var Where = 'Where recipes.recipeName Like ?'
    var inserts = '%' + searchSentence + '%';
    var sql = Select + From + Where;
    sql = mysql.format(sql, inserts);
    pool.getConnection(function(err, connection) {
      if (err) throw err;
      connection.query(sql, function (err, rows, fields) {
          if (!err) {
            connection.release();
            callback(null, rows);
          } else {
      
          };
        });
    });
  } else {
    callback(null,null);
  };
  
};

exports.searchTerm = function(searchTerm, callback) {
  if (searchTerm.length > 1) {
    var t = [];
    pool.getConnection(function(err, connection) {
      var Select = 'Select recipes.UID, recipes.recipeName, recipes.recipeDescription, recipes.shortDescription ';
      var From = 'From `recipes` ';
      var Where = 'Where recipes.recipeName Like ?'
      var sql = Select + From + Where;
      async.forEachOf(searchTerm, function(element, i , inner_callback) {
        var inserts = '%' + element + '%';
        var Innersql = mysql.format(sql, inserts);
        connection.query(Innersql, function(err, rows, fields){
          if(!err) {
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
  } else {
    callback(null, null);
  }
  
};

exports.searchIncludes = function(includes, callback) {
  if (includes.length > 0) {
    var t = [];
    pool.getConnection(function(err, connection) {
      var Select = 'Select ingredients.UID, ingredients.ingredient_name, recipes.recipeName, recipes.shortDescription ';
      var From = 'From `ingredients` ';
      var Join = 'Left Join `recipes` on ingredients.UID = recipes.UID ';
      var Where = 'Where ingredients.ingredient_name Like ?';
      var sql = Select + From + Join + Where;
      async.forEachOf(includes, function(element, i , inner_callback) {
        var inserts = '%' + element + '%';
        var Innersql = mysql.format(sql, inserts);
        connection.query(Innersql, function(err, rows, fields){
          if(!err) {
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
  } else {
    callback(null, null);
  }
  
};

exports.searchExcludes = function(excludes, callback) {
  if (excludes.length > 0) {
    console.log("excludes");
    var t = [];
    pool.getConnection(function(err, connection) {
      var Select = 'Select ingredients.UID, ingredients.ingredient_name ';
      var From = 'From `ingredients` ';
      var Where = 'Where ingredients.ingredient_name Like ?'
      var sql = Select + From + Where;
      async.forEachOf(excludes, function(element, i , inner_callback) {
        var inserts = '%' + element + '%';
        var Innersql = mysql.format(sql, inserts);
        connection.query(Innersql, function(err, rows, fields){
          if(!err) {
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
  } else {
    callback(null, null);
  }
  
};

exports.searchRecipeByUID = function(searchFor, callback) {
  var Select = 'Select * ';
  var From = 'From `recipes` ';
  var Where = 'Where recipes.UID LIKE ?';
  var inserts = searchFor;
  var sql = Select + From + Where;
  sql = mysql.format(sql, inserts);
  pool.getConnection(function(err, connection) {

    connection.query(sql, function (err, rows, fields) {
      if (!err) {
        connection.release();
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
    connection.query(sql, function (err, rows, fields) {
      if (!err) {
        connection.release();
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
    connection.query(sql, function (err, rows, fields) {
      if (!err) {
        connection.release();
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


exports.getPopularRecipes = function(callback) {
  pool.getConnection(function(err, connection) {
    var Select = 'Select recipes.UID ';
    var From = 'From `recipes` ';
    var Order = 'Order by recipes.views DESC ';
    var Limit = 'LIMIT 5';
    var sql = Select + From + Order + Limit;
    connection.query(sql, function(err, rows, fields) {
      if(!err){
        callback(null,rows);
      } else {
        callback(null, null);
      }
    })
  })

}

exports.incrementViews = function(uid, callback) {
  pool.getConnection(function(err, connection) {
    var Select = 'Select recipes.UID, recipes.views ';
    var From = 'From `recipes` ';
    var Where = 'Where recipes.UID LIKE ?';
    var sql = Select + From + Where;
    var insert = uid;
    var sql = mysql.format(sql, insert);
    connection.query(sql, function(err, rows, fields){
      if (!err) {
        if (rows.length > 0) {
          var Update = 'UPDATE recipes ';
          var _Set = 'SET views = ? ';
          Where = 'Where recipes.UID LIKE ?';
          sql = Update + _Set + Where;
          var insert = [rows[0].views + 1, uid];
          sql = mysql.format(sql, insert);
          connection.query(sql, function(err, i_rows, fields){
            if (!err) {
              connection.release();
              callback(null, "OK");
            } else {
              callback(null, "not ok");
            };
          });
        } else {
          callback(null, "not ok");
        };
    };
    });
  });
}