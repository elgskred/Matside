// routes/index.js
var recipeNames = ['kake1', 'kake2', 'kake3'];

exports.oppskrift = function(req, res) {
	console.log(req.body);
	recipeNames[recipeNames.length] = req.body.navn;
	res.send(recipeNames);
}
