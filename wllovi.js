var FOLDER_COMPONENTS = "./components/";
module.exports = function(obj,next){
    if(!obj.method){
        next("need a method");
        return;
    }
    var method;
    try{
        var jsPath = FOLDER_COMPONENTS+obj.method.replace(/\./g,"/");
        method = require(jsPath);
        method(obj,next);
    }
    catch(e){
        next("call method "+obj.method+" error: "+e.code);
    }
};
