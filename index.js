var http = require('http');
var process = require('process');
var path = require('path');
var url = require('url');
var util = require('./lib/util');
var wllovi = require('./wllovi');
var PORT = 8124;

var reqObj = function(request){
    return new Promise(function(resolve,reject){
        if(request.method === 'POST'){
            var queryData = "";
            request.on('data',function(data){
                queryData += data;
                if(queryData.length > 1e6){
                    queryData = "";
                    request.connection.destroy();
                    reject("data too large");
                }
            });

            request.on('end',function(){
                resolve(JSON.parse(queryData));
            });
        }
        else{
            resolve(url.parse(request.url,true).query);
        }

    });
};

http.createServer(function (request, response) {
    reqObj(request)
    .then(function(obj){
        wllovi(obj,function(result){
            response.writeHead(200, {'Content-Type': 'text/plain'});
            response.end(JSON.stringify(result));
        });
    },function(err){
        response.writeHead(200,{'Content-Type':'text/plain'});
        response.end(err);
    });
}).listen(PORT);

process.on('uncaughtException',function(err){
     console.log('uncaughtException',err);
});
console.log('Server running at http://127.0.0.1:'+PORT);
