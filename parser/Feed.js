define(['feedparser', 'request', 'moment', 'iconv', './constructArticle'], function (FeedParser, request, moment, Iconv, constructArticle) {

    function Feed(url) {
        this.website = url.name;
        this.websiteShort = url.websiteShort;
        this.url = url.url;
        this.language = url.language;
        this.game = url.game;
        this.theme = url.theme;
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
                    var article = feedArticle;
                    if (article !== undefined) {
                        self.verifyIfExist(article, function (exist) {
                            if (!exist) {
                                constructArticle(this, article, function (articleConstruct) {
                                    self.saveArticle(articleConstruct);
                                });
                            }
                        });
                    }
                }
            });
    };

    Feed.prototype.verifyIfExist = function (feedArticle, next) {
        db.collection('articles').findOne({title: feedArticle.title}, function (err, doc) {
            next(doc !== null);
        });
    };

    Feed.prototype.saveArticle = function (article) {
        var falseDate = false;

        if (article.pubDate > moment().toDate())
            falseDate = true;

        if (!falseDate) {

            var toInsert = article;
            toInsert.language = this.language;
            toInsert.website = this.website;

            db.collection('articles').insert(
                toInsert,
                function (error, numberRowModified) {
                    if (error) {
                        console.log("FAILED " + toInsert.website);
                        console.log("ERROR: " + error);
                    }
                    else {
                        console.log("new article from " + toInsert.website + ": " + toInsert.title);
                    }
                }
            );
        }
    };
    return Feed;
})
;
