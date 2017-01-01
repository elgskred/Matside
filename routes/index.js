// routes/index.js
var recipeNames = ['kake1', 'kake2', 'kake3'];
exports.index = function(req, res){
  var initialState = {
    items: [
      'document your code',
      'drop the kids off at the pool',
      '</script><script>alert(666)</script>'
    ],
    text: ''
  };
  console.log("Get");
  res.render('Html', { render: 'Index', data: initialState });
};

exports.oppskrift = function(req, res) {
	console.log(req.body);
	recipeNames[recipeNames.length] = req.body.navn;
	res.send("OK");
}


exports.list = function(req, res) {
	console.log("Getting list");
	console.log(recipeNames);
	var initialState = {
    items: [
      'document your code',
      'drop the kids off at the pool',
      '</script><script>alert(666)</script>'
    ],
    text: ''
  };
	res.render('Html', {render: 'List', data: initialState});
}
