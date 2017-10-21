const fs = require('fs');
const path = '../logs';
const fileName = '/errlogs.txt';
const newLine = '\n';



exports.writeToFile = function(data, callback) {
	dt = new Date();
	var yyyy = dt.getFullYear();
	var mm = dt.getMonth()+1; // getMonth() is zero-based
	var dd  = dt.getDate();
	var hh = dt.getHours();
	var mm = dt.getMinutes();
	var timeStamp = hh+':'+mm+'-'+dd+'/'+mm+'/'+yyyy;


	fs.mkdir(path, (err) => {
	if (err) {
		if (err.code === 'EEXIST') {
			fs.open(path + fileName, 'wx', (err) => {
				if (err) {
					if (err.code === 'EEXIST') {
						fs.appendFile(path + fileName, timeStamp + data + newLine, (err) => {
							if (err) callback(err);
						});
					return;
					}
					throw err;
				} else {
					fs.appendFile(path + fileName, timeStamp + data + newLine, (err) => {
						if (err) callback(err);
					});
				}
			})
		} else {

		}
	} else {
		fs.appendFile(path + fileName, timeStamp + data + newLine, (err) => {
			if (err) callback(err);
		});
	}
	});
}



