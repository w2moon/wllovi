//install this first https://github.com/w2moon/ktools
//ode ./bin/wllovi -method unpackDS -path /Users/wp/Library/Application\ Support/Steam/SteamApps/common/dont_starve/dontstarve_steam.app/Contents/data/anim/ -outpath /Users/wp/Documents/tutorial/spriter/DS
var util = require('../lib/util');
var zip = require('adm-zip');
var path = require("path");
var os = require("os");
var unzip = require("unzip");
var fstream = require("fstream");
var mkdirp = require('mkdirp');
var exec = require("child_process").exec;
var TMP_DIR = os.tmpdir();

function unpack(file,unzipDir,unpackDir,files){
   var bins;

   mkdirp.sync(unpackDir);

   if(util.exists(unzipDir+"/build.bin")){
      bins = unzipDir+"/build.bin";
   }
   else{
      bins = TMP_DIR+"/wilson/build.bin";
   }
   if(util.exists(unzipDir+"/anim.bin")){
        bins += " " + unzipDir + "/anim.bin";

   }
   else{
       return;
   }

    try{
        exec("krane "+ bins + " " +unpackDir,function(err){
            if(err){
                console.log("krane",file,err);
            }
        });
    }
    catch(e){
         console.log("exec",path.basename(file),e);
         fs.unlink(unpackDir,function(){});
    }
}

module.exports = function(obj,next){
    if(!obj.outpath){
        console.log("outpath needed");
        next();
        return;
    }
    util.scanFolder(obj.path)
        .then(function(files){
            for(var i=0,len=files.length;i<len;++i){
                var unzipDir = path.join(TMP_DIR,path.basename(files[i],".zip"));
                new zip(files[i]).extractAllTo(unzipDir,true);
                //fs.createReadStream(files[i])
                    //.pipe(unzip.Parse())
                    //.pipe(fstream.Writer(unzipDir));

            }

            for(var i=0,len=files.length;i<len;++i){
                var unzipDir = path.join(TMP_DIR,path.basename(files[i],".zip"));
                var unpackDir = path.join(obj.outpath,path.basename(files[i],".zip"));
                unpack(files[i],unzipDir,unpackDir,files);
            }
        });
}
