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
                             name:$(this).text(),
                             desc:$(this).next().text()
                         })
                     });
                });
                next(ret);

                window.close();
            });



}
