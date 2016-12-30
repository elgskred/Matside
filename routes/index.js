// routes/index.js

exports.index = function(req, res){
  res.render('Html', { name: 'John', occupation:"Driver", age: 22});
};

