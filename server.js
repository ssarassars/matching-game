
var http = require('http');
var fs = require('fs');
var mime = require('mime-types');
var url = require('url');
var board = require('./extra/makeBoard.js');

var ROOT = "./public_html";

//setting up the user object
var user = {};

//creating the server
var server = http.createServer(handleRequest);
server.listen(2406);

//PURPOSE: handle request using jquery
//Input:request
//Ouput: response
function handleRequest(req, res){
	var urlObj = url.parse(req.url, true);

	var data = "";
	var filename = ROOT + urlObj.pathname;

	//show the json file for the pathname /memory/intro?name=username
	if (urlObj.pathname === "/memory/intro")
	{
		if (req.method === "POST")
		{
			var info;

			req.on('data', function(inputdata){
				info = JSON.parse(inputdata);
			});

			req.on('end', function(){

				if (!(info['username'] in user))
				{
					var client = {"board" : board.makeBoard(4)};
					client.level = 4;
					//adding the info to the user list
					user[info['username']] = client;
				}

				data = JSON.stringify(user);
				respond(200, data);
			});
		}
	}
	else if (urlObj.pathname === "/memory/card")
	{

		var userBoard = user[urlObj.query.name].board;
		//check if it is out of bounds
		if (urlObj.query.indexj > userBoard.length || urlObj.query.indexj < 0 || urlObj.query.indexi > userBoard.length || urlObj.query.indexi < 0)
		{
			data = JSON.stringify(-1);
			respond(400, data);
		}
		else
		{
			var value = userBoard[urlObj.query.indexi][urlObj.query.indexj];
			data = JSON.stringify(value);
			respond(200, data);
		}

	}
	else
	{
		//check if the file exist
		if (fs.existsSync(filename)){
			//if the filename is the directory, show index.html
			var stats = fs.statSync(filename);
			if (stats.isDirectory()){
				filename += "/index.html";
			}

			//getting the file and read the data from the file
			data = fs.readFileSync(filename);
			respond(200, data);
		}
		//if the file doesn't exist, show 404.html
		else{
			data = fs.readFileSync(ROOT+"/404.html");
			respond(404, data);
		}
	}

	//send the data to the client
	function respond(code, data){
		res.writeHead(code, {'content-type': mime.lookup(filename)|| 'text/html'});
		res.end(data);
	}
}
