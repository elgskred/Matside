// routes/index.js

exports.index = function(req, res){
  res.render('index', { name: 'John' });
};