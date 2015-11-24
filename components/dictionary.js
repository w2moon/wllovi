var jsdom = require('jsdom');
var URL = "http://www.iciba.com/";

var obj2txt = function(ret){
    var lend = "\n";
    var sep = " ";
    var str = "";
    str += ret.name + lend;
    if(ret.speak.length>0) str += lend + ret.speak.join(';')+lend;
    if(ret.level.length>0) str += lend + ret.level.join(';')+lend;
    if(ret.change.length>0){
        str += lend;
        for(var i=0,len=ret.change.length;i<len;++i){
            str += ret.change[i].type;
            str += sep;
            str += ret.change[i].desc;
            str += lend;
        }
        str += lend;
    }
    if(ret.desc.length>0){
        str += lend;
        for(var i=0,len=ret.desc.length;i<len;++i){
            str += ret.desc[i].type;
            str += sep;
            str += ret.desc[i].desc;
            str += lend;
        }
        str += lend;
    }
    if(ret.english.length > 0){
        str += lend;
        for(var i=0,len=ret.english.length;i<len;++i ){
            str += ret.english[i].name;
            str += lend;
            str += ret.english[i].desc.join(lend);
            str += lend;
        }
        str += lend;
    }
    if(ret.relationship.length>0){
        str += lend;
        for(var i=0,len=ret.relationship.length;i<len;++i){
            str += ret.relationship[i].name;
            str += lend+lend;
            for(var j=0,jlen=ret.relationship[i].desc.length;j<jlen;++j){
                str += lend;
                str += ret.relationship[i].desc[j].name;
                str += lend;
                str += ret.relationship[i].desc[j].words.join(';');
                str += lend;
            }
            str += lend;
        }
    }

    if(ret.analyze.length > 0){
        for(var i=0,len=ret.analyze.length;i<len;++i){
            str += ret.analyze[i].name;
            str += ret.analyze[i].desc;
            str += lend;
        }
    }
    return str;
}
module.exports = function(obj,next){

    jsdom.env(URL+obj.content,
            ["http://libs.baidu.com/jquery/1.9.1/jquery.min.js"],
            function(err,window){
                var ret = {};
                if(err){
                    console.log(err);
                    next(err);
                    return;
                }
                var $ = window.$;

                var result = $('.result-info');
                ret.speak = [];
                ret.level = [];
                ret.desc = [];
                ret.change = [];
                ret.relationship = [];
                ret.analyze = [];
                ret.english = [];

                //base info
                var base = result.first();
                ret.name = base.find(".base-word").find(".word-text").text();
                               base.find(".base-speak").children("span").each(function(){
                    ret.speak.push($(this).text());
                });
                base.find(".base-level").children("span").each(function(){
                    ret.level.push($(this).text());
                });
                base.find(".base-list").children("li").each(function(){
                    if($(this).hasClass('change')){
                        $(this).find("p").children("span").each(function(){
                            ret.change.push({
                                type:$(this).text(),
                                desc:$(this).next().text()
                            });
                        })
                    }
                    else{
                        ret.desc.push({
                            type:$(this).find("span").text(),
                            desc:$(this).find("p").text().match(/[^\n\s]+/g).join('')
                        });
                    }
                });

                //english desc
                var english = result.find(".info-article:eq(4)");
                english.find('.article').each(function(){
                     var article = {};
                     article.name = $(this).find('.section-h p span').text();
                     article.desc = [];
                     $(this).find('.section-prep .prep-order p').each(function(){
                          article.desc.push($(this).text())
                     });
                     ret.english.push(article);
                });

                //synonoym and antonym
                result.find('.opposite-word').each(function(){
                     var relation = {};
                     relation.name = $(this).first().text();
                     relation.desc = [];
                     var cur = $(this).next();
                     while(cur.hasClass('collins-section')){
                         cur.children('.section-prep').each(function(){
                             var desc = {};
                             desc.name = $(this).find('.prep-order .weight-bold').text().match(/[^\n\s]+/g).join('');
                             desc.words = [];
                             $(this).find('.sentence-item p a').each(function(){
                                desc.words.push($(this).text());
                             });
                             relation.desc.push(desc);
                         });
                          cur = cur.next();
                     }
                     ret.relationship.push(relation);

                });

                //analyze
                result.find('.prep-order .text-sentence .item').each(function(){
                     $(this).find('a').each(function(){
                         ret.analyze.push({
                             name:$(this).text().match(/[^:\s]+/g)[0],
                             desc:$(this).next().text()
                         })
                     });
                });

                next(obj2txt(ret));

                window.close();
            });



}
