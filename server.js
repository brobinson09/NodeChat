var http = require('http');	
var fs	 = require('fs');	
var path = require('path');				
var mime = require('mime');	
var chatServer = require('./lib/chat_server2')	
 		
var cache = {};

function send404(response){
	response.writeHead(404, {'Content-Type': 'text/plain'});
	response.write('Error 404: resource not found ');
	response.end();
}

function sendFile(response, filepath, fileContents){
	response.writeHead(
		200,
		{'content-type': mime.lookup(path.basename(filepath))}
		);
	response.end(fileContents);
	console.log('Sent File ');
}

function serverStatic(response, cache, absPath){
	console.log('New request: ' + absPath);
	if(cache[absPath]){
		sendFile(response, absPath, cache[absPath]);
	} else {
		fs.exists(absPath, function(exists) {
			if(exists){
				fs.readFile(absPath, function(err, data) {
					if(err) {
						send404(response);
					} else {
						cache[absPath] = data;
						sendFile(response, absPath, data);
					}
				});
			} else {
				send404(response);
			} 
		});
			
	}
}

var server = http.createServer(function(request, response) {
	var filepath = false;

	if(request.url == '/'){
		filepath = 'public/index.html';
	} else {
		filepath = 'public' + request.url;
	}

	var absPath = './' + filepath;
	console.log(request.connection.localAddress + ' connected');
	serverStatic(response, cache, absPath);
	console.log('Served');
});

port = process.env.PORT || 5000;
server.listen(port, function() {
	console.log('Server is running at localhost:' +port);
});

chatServer.listen(server);