// routes/index.js

exports.index = function(req, res){
  res.render('index', { name: 'John', occupation:"Driver", age: 22 });
};