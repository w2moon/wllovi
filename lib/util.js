var fs = require('fs');
var path = require('path')
var util = {};

/**
 * scan a folder,ignore folders:.git,.svn.
 *
 * @param  {string} folder The folder to scan
 * @param  {object} options recursive, ignoreFolders, ext
 * @return {Promise}
 *
 * @example util.scanFolder( "path",
 *                           {
 *                              recursive:true
 *                              ,ignoreFolders:['tmp']
 *                              ,ext:['.js']
 *                           }
 *                          )
 */
util.scanFolder = function(folder,options){
    var files = [];
    var ignoreFolders = [".git",".svn"];
    var opt = Object.assign({ignoreFolders:[]},options);
    opt.ignoreFolders = opt.ignoreFolders.concat(ignoreFolders);
    var walk = function(folder){
        return new Promise(
            function(resolve,reject){
                if(!folder){
                    resolve(files);
                    return;
                }
                fs.readdir(folder,function(err,items){
                    if(!items){
                        resolve(files);
                        return;
                    }
                    var subps = [];
                    items.forEach(function(item){
                        var tmpPath = path.resolve(folder,item);
                        var stat;
                        try{

                            stat = fs.statSync(tmpPath)

                            if(stat.isDirectory()){
                                if(opt.recursive && opt.ignoreFolders.indexOf(item)===-1){
                                    subps.push(walk(tmpPath));
                                }
                            }
                            else{
                                if(!opt.ext || opt.ext.indexOf(path.extname(item))!==-1){
                                    files.push(tmpPath);
                                }
                            }
                        }
                        catch(e){
                            console.log(e);
                        }
                    });
                    Promise.all(subps).then(function(){
                         resolve(files);
                    });
                });
            }
        );

    };
    return walk(folder);
}

util.exists = function(file){
    try{
        fs.accessSync(file);
    }
    catch(e){
        return false;
    }
    return true;

}

util.arg2json = function(arg){
    var reg = /^-*(.+)/i
    var obj = {};
    obj.__scriptPath="";
    for(var i=2,len=arg.length;i<len;i+=2){
        var m = reg.exec(arg[i]);
        if(m === null){
            console.log("error param: ",arg[i]);
            break;
        }
        obj[m[1]] = arg[i+1];

    }
    return obj;
}


module.exports = util;
