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
                    var article = self.shapeArticle(feedArticle);
                    self.saveArticle(article);
                }
            });
    };

    Feed.prototype.shapeArticle = function (feedArticle) {
        var article = {
            title: feedArticle.title,
            category: constructArticle.setCategory(this, feedArticle),
            author: constructArticle.setAuthor(this, feedArticle.author),
            pubDate: constructArticle.setPubDate(this, feedArticle.pubDate),
            url: constructArticle.setUrl(this, feedArticle.link)
        };
        return article;
    };

    Feed.prototype.saveArticle = function (article) {
        var falseDate = false;

        if (article.pubDate > moment().toDate())
            falseDate = true;

        if (!falseDate) {

            var toInsert = article;
            toInsert.language = this.language;
            toInsert.website = this.website;

            db.collection('articles').update(
                {
                    title: article.title,
                    website: this.website,
                    category: article.category
                },
                { $set: toInsert},
                { upsert: true},
                function (error, saved) {
                    if (error || !saved) {
                        console.log("FAILED " + website);
                        console.log("ERROR: " + error);
                        console.log("save: " + saved);
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
