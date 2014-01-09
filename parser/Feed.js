define(['feedparser', 'request', 'moment', 'iconv','./constructEsportArticle'], function (FeedParser, request, moment, Iconv, constructEsportArticle) {

    function Feed(website, websiteShort, url, language, game, theme) {
        this.website = website;
        this.websiteShort = websiteShort;
        this.url = url;
        this.language = language;
        this.game = game;
        this.theme = theme;
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

        if(self.theme === "classic")
            feedArticle.pubDate = moment(feedArticle.pubDate).toDate();
        else if(self.theme === "esport")
            feedArticle = constructEsportArticle(self, feedArticle);

        callback(feedArticle, self.website, self.language);

    };

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
