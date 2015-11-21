var util = require('../lib/util');

module.exports = function(obj,next){
    util.scanFolder(obj.path,{recursive:true})
    .then(next);
}
