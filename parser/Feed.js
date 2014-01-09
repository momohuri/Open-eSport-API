define(['feedparser', 'request', 'moment', 'iconv','./cleanArticleBasedOnRules'], function (FeedParser, request, moment, Iconv,cleanArticleBasedOnRules) {

    function Feed(website, websiteShort, url, language, game) {
        this.website = website;
        this.websiteShort = websiteShort;
        this.url = url;
        this.language = language;
        this.game = game;
        this.getArticles();
    }


    Feed.prototype.getArticles = function () {
        var self = this;

        request(this.url)
            .pipe(new FeedParser())
            .on('error', function (error) {
                console.error(self.website + ": " + error + ". Game: " + self.game);
            })
            .on('readable', function () {
                var stream = this, item;
                while (feedArticle = stream.read()) {
                    self.shapeArticle(feedArticle, self.saveArticle);
                }
            });
    };

    Feed.prototype.shapeArticle = function (feedArticle, callback) {
        var self = this;

        feedArticle = cleanArticleBasedOnRules(self, feedArticle);
        feedArticle.titleDate = feedArticle.title + "-" + feedArticle.pubDate;
        feedArticle.category = self.setCategory(feedArticle);

        callback(feedArticle,self.language,self.language);

    };

    Feed.prototype.checkIfAlreadyExist = function (article, callback) {
        var self = this;
        db.collection('articles').findOne({
            $or: [
                { $and: [
                    { titleDate: article.titleDate },
                    { category: article.category }
                ] },
                { $and: [
                    { title: article.title },
                    { website: self.website },
                    { category: article.category }
                ] }
            ]
        }, function(error, articleFound){
            if(error) throw error;
            else if(!articleFound || typeof articleFound == 'undefined'){
                var id_url = null;

                if (self.website === "Millenium") {
                    id_url = article.link.split("-");
                    id_url = id_url[id_url.length - 1];
                }
                else if (self.website === "Team aAa") {
                    id_url = article.link.split("/");
                    id_url = id_url[3].split("-");
                    id_url = id_url[1];
                }
                else if (self.website === "Esport Actu") {
                    id_url = article.link.split("/");
                    id_url = id_url[4].split("-");
                    id_url = id_url[0];
                }

                if (id_url != null) {
                    db.collection('articles').find({website: self.website}).toArray(function (err, articlesDuplicate) {
                        articlesDuplicate.forEach(function (articleDuplicate) {
                            if (articleDuplicate.link.indexOf(id_url) != -1) {
                                db.collection('articles').remove({link: articleDuplicate.link})
                            }
                        })
                        callback(true);
                    })
                }
                else callback(true);
                //Suppression des articles avec le même URL
                // db.collection('articles').remove({
                //     link: article.link
                // }, function(){
                //     if(self.website === "SK Gaming")
                //         console.log("removed: " + article.title)
                // });
            }
            else callback(false);
        });
    }

    Feed.prototype.setCategory = function (article) {
        var category = null;

        //set categories
        if (this.game == null) {
            if (typeof article.category != 'undefined')
                category = this.setCategoryGame(article.category);
            else
                category = this.setCategoryGame(article.categories);

            if (category == null)
                category = this.websiteShort;
        }
        else
            category = this.game;

        return category
    }

    Feed.prototype.setCategoryGame = function (cat) {
        var category;

        if ((cat.toString().toLowerCase().indexOf("starcraft") > -1) || (cat.toString().toLowerCase().indexOf("sc2") > -1))
            category = "sc2";
        if ((cat.toString().toLowerCase().indexOf("dota 2") > -1) || (cat.toString().toLowerCase().indexOf("dota2") > -1) || (cat.toString().toLowerCase().indexOf("defense of the ancients") > -1))
            category = "dota2";
        if ((cat.toString().toLowerCase().indexOf("lol") > -1) || (cat.toString().toLowerCase().indexOf("league of legends") > -1))
            category = "lol";
        if ((cat.toString().toLowerCase().indexOf("csgo") > -1) || (cat.toString().toLowerCase().indexOf("counter-strike") > -1))
            category = "csgo";
        if ((cat.toString().toLowerCase().indexOf("ql") > -1) || (cat.toString().toLowerCase().indexOf("quake") > -1))
            category = "ql";
        if ((cat.toString().toLowerCase().indexOf("hearthstone") > -1))
            category = "hearthstone";
        if ((cat.toString().toLowerCase().indexOf("sf4") > -1) || (cat.toString().toLowerCase().indexOf("street fighter") > -1) ||
            (cat.toString().toLowerCase().indexOf("baston") > -1))
            category = "versus";

        return category;
    }

    Feed.prototype.setAuthor = function (article) {
        if (this.website === "Millenium" || this.website === "Team aAa" || this.website === "SK Gaming")
            return this.website;
        else
            return article.author;
    }

    Feed.prototype.setPubDate = function (article) {
        var pubDate = moment(article.pubDate).toDate();

        if (this.website === "Millenium") {
            pubDate = moment().toDate();
        }

        if (this.website === "Team aAa")
            pubDate = moment(pubDate).add('hours', 2).toDate();

        return pubDate;
    }

    Feed.prototype.setUrl = function (article) {
        if (this.website === "Reddit")
            return article.link + ".compact";
        else
            return article.link;
    }


    Feed.prototype.saveArticle = function (article, website, language) {
        var falseDate = false;

        if (article.pubDate > moment().toDate())
            falseDate = true;

        if (!falseDate) {
            db.collection('articles').update(
                {
                    title: article.title,
                    website: website,
                    category: article.category
                },
                { $set: {
                    title: article.title,
                    website: website,
                    category: article.category,
                    link: article.link,
                    pubDate: article.pubDate,
                    author: article.author,
                    language: language,
                    titleDate: article.titleDate
                }
                },
                {
                    upsert: true
                }
                ,function(error, saved)
                {
                     if(error || !saved)
                     {
                         console.log("FAILED " + website);
                         console.log("ERROR: " + error);
                         console.log("save: " + saved);
                     }
                     else
                     {
                         // if(website === "Millenium")
                         // console.log("new article from " + website + ": " + saved[0].title);
                     }
                }
            );
        }

    }

    return Feed;
});
