define(['feedparser', 'request', 'moment', 'iconv'], function(FeedParser, request, moment, Iconv){

    function Feed(website, websiteShort, url, language, game){
        this.website = website;
        this.websiteShort = websiteShort;
        this.url = url;
        this.language = language;
        this.game = game;
        this.getArticles();
    }


    Feed.prototype.getArticles = function(){
        // console.log("getArticle " + this.website);
        var self = this;

        var ficonv = Iconv.Iconv;
        if(this.web === "eSportsFrance"){
            var iconv = new ficonv('ISO-8859-1', 'utf-8');
        }else{
            var iconv = new ficonv('utf-8', 'utf-8');
        }

        request(this.url)
            // .pipe(iconv)
            .pipe(new FeedParser())
            .on('error', function(error) {
                console.error(self.website + ": " + error + "game: " + self.game);
            })
            .on('article', function(feedArticle) {
                self.shapeArticle(feedArticle, self.saveArticle);
            })
            .on('end', function () {
                // console.log("finished " + self.website);
            });
    }

    Feed.prototype.shapeArticle = function(feedArticle, callback){
        var self = this;

        feedArticle.titleDate = feedArticle.title + "-" + feedArticle.pubDate;

        this.checkIfAlreadyExist(feedArticle, function(){
            var cleanArticle = {};

            cleanArticle.title      = feedArticle.title;
            cleanArticle.link       = feedArticle.link;
            cleanArticle.titleDate  = feedArticle.titleDate;

            cleanArticle.category   = self.setCategory(feedArticle);
            cleanArticle.author     = self.setAuthor(self.website);
            cleanArticle.pubDate    = moment(feedArticle.pubDate).toDate();

            callback(cleanArticle, self.website, self.language);
        });
    }

    Feed.prototype.checkIfAlreadyExist = function(article, callback){
        var self = this;

        db.collection('articles').findOne({
            titleDate: article.titleDate
        }, function(error, articleFound){
            if(error) console.log("Error");
            else if(!articleFound || typeof articleFound == 'undefined'){
                var id_url = null;

                if(self.website == "eSportsFrance"){
                    id_url = article.link.split("/");
                    id_url = id_url[5].split("-");
                    id_url = id_url[0];

                }
                if(self.website == "Millenium"){
                    id_url = article.link.split("-");
                    id_url = id_url[id_url.length-1];
                }
                if(self.website == "Team aAa"){
                    id_url = article.link.split("/");
                    id_url = id_url[3].split("-");
                    id_url = id_url[1];
                }

                if(id_url != null){
                    var likeTitle = ".*" + id_url + ".*";
                    db.collection('articles').find({website: self.website}).toArray(function(err, articlesDuplicate){
                        articlesDuplicate.forEach(function(articleDuplicate){
                            if(articleDuplicate.link.indexOf(id_url) != -1){
                                db.collection('articles').remove({link: articleDuplicate.link})
                            }
                        })
                    })
                }

                //Suppression des articles avec le même URL
                db.collection('articles').remove({
                    link: article.link
                });
                callback();
            }
        });
    }

    Feed.prototype.setCategory = function(article){
        var category = null;

        //set categories
        if(this.game == null){
            if(typeof article.category != 'undefined')
                category = this.setCategoryGame(article.category);
            else
                category = this.setCategoryGame(article.categories);
            
            if(category == null)
                category = this.websiteShort;
        }
        else
            category = this.game;

        return category
    }

    Feed.prototype.setCategoryGame = function(cat){
        var category;

        if((cat.toString().toLowerCase().indexOf("starcraft") > -1) || (cat.toString().toLowerCase().indexOf("sc2") > -1))
            category = "sc2";
        if((cat.toString().toLowerCase().indexOf("dota2") > -1) || (cat.toString().toLowerCase().indexOf("defense of the ancients") > -1))
            category = "dota2";
        if((cat.toString().toLowerCase().indexOf("lol") > -1) || (cat.toString().toLowerCase().indexOf("league of legends") > -1))
            category = "lol";
        if((cat.toString().toLowerCase().indexOf("csgo") > -1) || (cat.toString().toLowerCase().indexOf("counter-strike") > -1))
            category = "csgo";
        if((cat.toString().toLowerCase().indexOf("sm") > -1))
            category = "sm";
        if((cat.toString().toLowerCase().indexOf("ql") > -1))
            category = "ql";
        if((cat.toString().toLowerCase().indexOf("sf4") > -1) || (cat.toString().toLowerCase().indexOf("street fighter") > -1) || 
            (cat.toString().toLowerCase().indexOf("baston") > -1))
            category = "sf4";

        return category;
    }

    Feed.prototype.setAuthor = function(article){
        if(this.website === "Millenium" || this.website === "Team aAa")
            return this.website;
        else 
            return article.author;
    }  

    Feed.prototype.saveArticle = function(article, website, language){
        db.collection('articles').save({ 
            title:          article.title, 
            website:        website,
            category:       article.category,
            link:           article.link,
            pubDate:        article.pubDate,
            author:         article.author,
            language:       language,
            titleDate:      article.titleDate
        });
    } 

    return Feed;
});
