var jsdom = require('jsdom');

var URL = "http://www.iciba.com/";

module.exports = function(obj,next){

    jsdom.env(URL+obj.content,
            ["http://code.jquery.com/jquery.js"],
            function(err,window){
                var ret = {};
                if(err){
                    console.log(err);
                    next(err);
                    return;
                }
                var $ = window.$;

                $('.result-info .info-article').each(function(index){
                    switch(index){
                        case 0:
                            //base info
                            ret.name = $(this).find(".base-word").find(".word-text").text();
                            ret.speak = [];
                            ret.level = [];
                            ret.desc = [];
                            ret.change = [];
                            $(this).find(".base-speak").children("span").each(function(){
                                ret.speak.push($(this).text());
                            });
                            $(this).find(".base-level").children("span").each(function(){
                                ret.level.push($(this).text());
                            });
                            console.log("ddff")
                            console.log($(this).find("ul.base-list li"))
                            $(this).find(".base-list").children("li").each(function(){
                                console.log("list")
                                if($(this).hasClass('change')){
                                    $(this).find("p").children("span").each(function(){
                                        ret.change.push({
                                            type:$(this).text(),
                                            desc:$(this).next().text()
                                        });
                                    })
                                }
                                else{
                                    console.log("???");
                                    ret.desc.push({
                                        type:$(this).find("span").text(),
                                        desc:$(this).find("p").text().match(/[^\n\s]+/g).join('')
                                    });
                                }
                            });
                            break;
                    }
                });

                next("suc");

                console.log(ret)
                window.close();
            });



}
