var http = require('http');
var process = require('process')
var path = require('path');
var url = require('url');
var util = require('./lib/util');
var domain = require('domain');

var FOLDER_COMPONENTS = "./components/";
var PORT = 8124;

var callMethod = function(obj,next){
    if(!obj.method){
        next("need a method");
        return;
    }
    var method;
    try{
        method = require(FOLDER_COMPONENTS+obj.method.replace(/\./g,"/"));
        method(obj,next);
    }
    catch(e){
        next("call method "+obj.method+" error: "+e.code);
    }
}

http.createServer(function (request, response) {
    var obj = url.parse(request.url,true).query;
    callMethod(obj,function(result){
        response.writeHead(200, {'Content-Type': 'text/plain'});
        response.end(JSON.stringify(result));
    })
}).listen(PORT);

process.on('uncaughtException',function(err){
     console.log('uncaughtException',err);
})
console.log('Server running at http://127.0.0.1:'+PORT);
