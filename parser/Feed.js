define(['feedparser', 'request', 'iconv', './constructArticle'], function (FeedParser, request, Iconv, constructArticle) {

    function Feed(url) {
        this.website = url.name;
        this.websiteShort = url.websiteShort;
        this.url = url.url;
        this.language = url.language;
        this.id = url.id;
        this.theme = url.theme;
        this.type = url.type;
        this.getArticles();
    }

    Feed.prototype.getArticles = function () {
        var self = this;
        //ugly but enougth for the moment
        switch (this.type) {
            case 'api':

                var page = 1;
                request.get(this.url, function (err, res, body) {
                    if (err) throw err;
                    var json = JSON.parse(body);
                    var maxPage = json.meta.total / json.meta.per_page;
                    requestAgain();
                    function requestAgain() {
                        request.get(self.url + '&page=' + page, function (err, res, body) {
                            if (err) throw err;
                            try {
                                var json = JSON.parse(body);
                                json.events.forEach(function (event) {
                                    eachArticle(event);
                                });
                            } catch (err) {
                                console.log(err);
                            }

                            if (++page < maxPage) requestAgain()
                        });
                    }
                });

                break;
            case 'feed':
                request(this.url).pipe(new FeedParser()).on('error', function (error) {
                    console.error(self.website + ": " + error);
                })
                    .on('readable', function () {
                        var stream = this, item;
                        while (feedArticle = stream.read()) {
                            eachArticle(feedArticle);
                        }
                    });
                break;

        }


        function eachArticle(article) {
            if (article !== undefined) {
                self.verifyIfExist(article, function (exist) {
                    if (!exist) {
                        constructArticle(self, article, function (articleConstruct) {
                            self.saveArticle(articleConstruct);
                        });
                    }
                });
            }
        }
    };

    Feed.prototype.verifyIfExist = function (feedArticle, next) {
        //todo , redondant woth construct
        var url;
        if (feedArticle["xcal:url"] !== undefined) url = feedArticle["xcal:url"]['#'];
        if (feedArticle.url !== undefined) url = feedArticle.url;
        dbCheck.collection('articles').findOne({url: url }, function (err, doc) {
            if (err) throw err;
            next(doc !== null);
        });
    };

    Feed.prototype.saveArticle = function (article) {
        var toInsert = article;
        toInsert.language = this.language;
        toInsert.website = this.website;
        dbCheck.collection('articles').insert(toInsert, function (error, numberRowModified) {
            if (error) {
                console.log("FAILED " + toInsert.website);
                console.log("ERROR: " + error);
            }
        });

        db.collection('articles').insert(toInsert, function (error, numberRowModified) {
                if (error) {
                    console.log("FAILED " + toInsert.website);
                    console.log("ERROR: " + error);
                }
                else {
                    //to slow
//                     console.log("new article from " + toInsert.website + ": " + toInsert.title);
                }
            }
        );
    };

    return Feed;
});
