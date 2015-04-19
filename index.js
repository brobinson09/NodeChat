var http = require('http');
var fs = require('fs');

port = process.env.PORT || 5000;
http.createServer(function (req, res) {
	res.writeHead(200,{'Content-Type': 'image/jpg'});
	fs.readdir('./images', function(err, files) {
		console.log(files);
		if(err) {
			throw err;
		}
		else{
			image = Math.floor(Math.random() * (files.length) );
			fs.createReadStream('./images/'+files[image]).pipe(res);
		}
	});
}).listen(port);
console.log('Server is running at localhost:' +port);