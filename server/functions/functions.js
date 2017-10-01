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
  var Insert = 'Insert Into `recipes` (recipeName, recipeDescription, shortDescription, servings) ';
  var Values = 'Values (?, ?, ?, ?)';
  var sql = Insert + Values;
  var inserts = [body.name, body.recipe, body.desc, body.servings];
  sql = mysql.format(sql, inserts);
  pool.getConnection(function(err, connection) {
    connection.query(sql, function(err, rows, fields){
      if(!err){
        connection.release();
        callback(null, rows.insertId);
      } else {
        connection.release();
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
          connection.release();
          inner_callback(err);
        }
      });
    }, function(err) {
      if (err) {
        connection.release();
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
    async.forEachOf(body.tags, function(element, i , inner_callback) {
      var inserts = [UID, element];
      var Innersql = mysql.format(sql, inserts);
      connection.query(Innersql, function(err, rows, fields){
        if(!err) {
          inner_callback(null);
        } else {
          connection.release();
          inner_callback(err);
        }
      })
    }, function(err) {
      if (err) {
        connection.release();
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
          connection.release();
          inner_callback(err);
        }
      })
    }, function(err) {
      if (err) {
        connection.release();
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
            connection.release();      
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
            connection.release();
            inner_callback(err);
          }
        })
      }, function(err) {
        if (err) {
          connection.release();
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
            connection.release();
            inner_callback(err);
          }
        })
      }, function(err) {
        if (err) {
          connection.release();
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
            connection.release();
            inner_callback(err);
          }
        })
      }, function(err) {
        if (err) {
          connection.release();
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
        connection.release();
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
        connection.release();
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
        connection.release();
      };
    });
  });
};

exports.searchKeywordsByUID = function(searchFor, callback) {
  console.log("Searching for keywords");
  var Select = 'Select * ';
  var From = 'From `keywords` ';
  var Where = 'Where keywords.UID LIKE ?';
  var inserts = searchFor;
  var sql = Select + From + Where;
  sql = mysql.format(sql, inserts);
  pool.getConnection(function(err, connection) {
    connection.query(sql, function (err, rows, fields) {
      if (!err) {
        connection.release();
        callback(null, rows);
      } else {
        connection.release();
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
          connection.release();
          inner_callback(err);
        }
      })
    }, function(err) {
      if (err) {
        connection.release();
      } else {
        connection.release();
        callback(null, t);
      };
    });
  });
};




exports.getPopularRecipes = function(callback) {
  pool.getConnection(function(err, connection) {
    var Select = 'Select recipes.UID, recipes.recipeName ';
    var From = 'From `recipes` ';
    var Order = 'Order by recipes.views DESC ';
    var Limit = 'LIMIT 5';
    var sql = Select + From + Order + Limit;
    connection.query(sql, function(err, rows, fields) {
      if(!err){
        connection.release();
        console.log(rows);
        callback(null,rows);
      } else {
        connection.release();
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
              connection.release();
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

exports.updateRecipe = function(body, callback) {
  pool.getConnection(function(err, connection) {
    var Update = 'UPDATE recipes ';
    var _Set = 'SET recipeName = ?, shortDescription = ?, recipeDescription = ?, servings = ? ';
    var Where = 'WHERE recipes.UID LIKE ?';
    var sql = Update + _Set + Where;
    var insert = [body.recipeName, body.shortDesc, body.recipe, body.servings, body.UID];
    sql = mysql.format(sql, insert);
    //console.log(sql);
    connection.query(sql, function(err, rows, fields){
      if (!err) {
        //If no error is returned
        connection.release()
        //console.log(rows);
        callback(null, "OK");
      } else {
        connection.release()
        //console.log(err);
        callback(null, "Error");
      }
    })
  });
}

exports.updateIngredients = function(body, callback) {
  console.log("updateIngredients");
  pool.getConnection(function(err, connection) {
    var countQuery = 'SELECT COUNT(ingredient_name) AS cnt FROM `ingredients` WHERE ingredient_id = ?';
    var updateQuery = 'UPDATE ingredients SET ingredient_name = ?, ingredient_amount = ? WHERE ingredient_id LIKE ?';
    var insertQuery = 'INSERT INTO `ingredients` (UID, ingredient_name, ingredient_amount) VALUES (?, ?, ?)';
    var deleteQuery = 'DELETE FROM ingredients WHERE ingredient_id = ?'
    async.forEachOf(body.ingredients, function(element, i , inner_callback) {
      var insert = [body.ingredient_id[i]];
      var sql = mysql.format(countQuery, insert);
      connection.beginTransaction(function(err){
        if (err) {throw err;}
        //No point in updating if the field is empty
        if (element != "" || body.amounts[i] != ""){
          connection.query(sql, function(err, rows, fields){
            if (err) {
              return connection.rollback(function() {
                throw err;
              });
            }
            //If ingredient_id allready exists, update it.
            if (rows[0]['cnt'] > 0){
              insert = [element, body.amounts[i], body.ingredient_id[i]];
              var updateSql = mysql.format(updateQuery, insert);
              connection.query(updateSql, function(err, rows, fields){
                if (err) {
                  return connection.rollback(function(){
                    throw err;
                  });
                }
                connection.commit(function(err){
                  if (err) {
                    return connection.rollback(function(){
                      throw err;
                    })
                  }
                  console.log("Update Success");
                  inner_callback(null);
                })
              })
              //If the ingredient_id is nonexistant, insert a new row.
            } else if (rows[0]['cnt'] == 0){
              insert = [body.UID, element, body.amounts[i]];
              var insertSql = mysql.format(insertQuery, insert);
              connection.query(insertSql, function(err, rows, fields){
                if (err) {
                  return connection.rollback(function(){
                    throw err;
                  });
                }
                connection.commit(function(err){
                  if (err) {
                    return connection.rollback(function(){
                    });
                  }
                  console.log("Insert Success");
                  inner_callback(null);
                })
              })
            }
          })
        }
        if (element == "" && body.amounts[i] == "" && body.ingredient_id[i] != null){
          console.log("empty field");
          insert = [body.ingredient_id[i]];
          var deleteSql = mysql.format(deleteQuery, insert);
          connection.query(deleteSql, function(err, rows, fields){
            if (err) {
              return connection.rollback(function(){
                throw err;
              });
            }
            connection.commit(function(err){
              if (err) {
                return connection.rollback(function() {
                });
              }
              console.log("Delete Success");
              inner_callback(null);
            })
          })
        }
      })
    }, function(err) {
      if (err) {
        connection.release();
      } else {
        connection.release();
        callback(null, "OK");
      };
    });
  });
}

exports.updateImages = function(body, callback) {
  var countQuery = 'SELECT COUNT(imagePath) AS cnt FROM `pictures` WHERE imagePath = ?';
  var insertQuery = 'INSERT INTO `pictures` (UID, imagePath) VALUES (?, ?)';
  var deleteQuery = 'DELETE FROM pictures WHERE imagePath = ?';
  console.log("updating images");
  pool.getConnection(function(err, connection) {
    async.forEachOf(body.imgPath, function(element, i, inner_callback) {
      connection.beginTransaction(function(err) {
        if (err) {throw err;}
        var insert = [element];
        var sql = mysql.format(countQuery, insert);
        connection.query(sql, function(err, rows, fields) {
          if (err) {
            return connection.rollback(function() {
              throw err;
            });
          }
          if (rows[0]['cnt'] == 0) {
            console.log("Inserting new image row");
            insert = [body.UID, element];
            var insertSql = mysql.format(insertQuery, insert);
            connection.query(insertSql, function(err, rows, fields) {
              if (err) {
                return connection.rollback(function(){
                  throw err;
                });
              }
              connection.commit(function(err){
                if (err) {
                  return connection.rollback(function(){
                    throw err;
                  });
                }
                console.log("Image insert Success");
                inner_callback(null);
              })
              
            })
          }
        })

      });
    }, function(err) {
      if (err) {
        connection.release();
      } else {
        connection.release();
        callback(null, "OK");
      }
    });
  }); 
}

exports.updateKeywords = function(body, callback) {
  var countQuery = 'SELECT COUNT(keyword) AS cnt FROM `keywords` WHERE keyword = ?';
  var insertQuery = 'INSERT INTO `keywords` (UID, keyword) VALUES (?, ?)';
  var deleteQuery = 'DELETE FROM `keywords` WHERE UID = ?';
  console.log("updating keywords");
  console.log(body.keywordTags);
  pool.getConnection(function(err, connection) {
    connection.beginTransaction( function(err) {
      if (err) {throw err;}
      var sql = mysql.format(deleteQuery, body.UID);
      connection.query(sql, function(err, rows, fields) {
        if (err){
          return connection.rollback(function() {
            throw err;
          });
        }
      })
      async.forEachOf(body.keywordTags, function(element, i, inner_callback) {
        console.log("Inserting new keyword");
        insert = [body.UID, element['text']];
        console.log(element['text']);
        var insertSql = mysql.format(insertQuery, insert);
        connection.query(insertSql, function(err, rows, fields) {
          if (err) {
            return connection.rollback(function(){
              throw err;
            });
          }
          connection.commit(function(err){
            if (err) {
              return connection.rollback(function(){
                throw err;
              });
            }
            console.log("Keyword insert Success");
            inner_callback(null);
          }) 
        })
      }, function(err) {
        if (err) {
          connection.release();
        } else {
          connection.release();
          callback(null, "OK");
        }
      });
    })    
  }); 
}


