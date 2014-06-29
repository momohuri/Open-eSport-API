define(['feedparser', 'request', './constructArticle', 'http'], function (FeedParser, request, constructArticle, http) {

    function Feed(url) {
        errorNum = 0;
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
        switch (this.id) {
            case 'stubhub':
                var buffer = '';
                var first = true;
                http.get(this.url, function (res) {
                    console.log("Got response: " + res.statusCode);
                    res.setEncoding('utf8');
                    res.on('data', function (data) {
                        buffer += data;
                        if (first) {
                            var firstDoc = buffer.indexOf('{"stubhubDocumentId');
                            if (firstDoc == -1) {
                                buffer = buffer.substring(0, buffer.length);
                            } else {
                                buffer = buffer.substring(firstDoc, buffer.length);
                                first = false;
                            }
                        }
                        if (buffer.search('},') !== -1) {  //if we we have at least one complete json (we assume that we don't have json in json)
                            var n = buffer.lastIndexOf('},');
                            var result = buffer.substring(0, n + 1);
                            buffer = buffer.substring(n + 2, buffer.length);
                            result = JSON.parse("[" + result + "]");
                            for (var i = 0; i < result.length; i++) {
                                eachArticle(result[i]);
                            }
                        }


                    })
                }).on('error', function (e) {
                    console.log("Got error: " + e.message + ', for stubhub');
                });

                break;
            case 'eventbrite':
                var page = 1;

            function get(page) {
                var body = '';
                http.get(self.url + page, function (res) {
                    res.on('data', function (data) {
                        body += data;
                    });
                    res.on('end', function () {
                        body = JSON.parse(body).events;
                        if (body === undefined) return;
                        if (body.length === 101) {
                            get(++page)
                        }
                        for (var i = 1; i < body.length; i++) {
                            eachArticle(body[i].event);
                        }
                    });

                }).on('error', function (e) {
                    console.log("Got error: " + e.message + ', for eventbride');
                });
            }

                get(page);

                break;

        }


        function eachArticle(article) {
            if (self.id === "stubhub" && (article.active != 1 || article.maxPrice === 0)) {
                return;
            }
            if (self.id === "eventbrite" && article.status != "Live") {
                return;
            }
            var date = constructArticle.setStart(article, self.id);
            if (article !== undefined && new Date(date) > new Date()) {
                self.verifyIfExist(article, function (exist) {
                    if (!exist) {
                        constructArticle.setAll(article, self, function (articleConstruct) {
                            if (articleConstruct) {
                                self.saveArticle(articleConstruct);
                            }
                        });
                    }
                });
            }
        }
    };

    Feed.prototype.verifyIfExist = function (feedArticle, next) {
        var id = constructArticle.setId(feedArticle, this.id);
        dbCheck.collection('articles2').findOne({eventId: id }, function (err, doc) {
            if (err) throw err;
            next(doc !== null);
        });
    };

    Feed.prototype.saveArticle = function (article) {
        var toInsert = article;
        toInsert.language = this.language;
        toInsert.website = this.website;

        dbCheck.collection('articles2').insert({eventId: article.eventId, insertDate: new Date()}, function (error, numberRowModified) {
            if (error) {
                console.log("FAILED " + toInsert.website);
                console.log("ERROR: " + error);
            } else {
                db.collection('articles').insert(toInsert, function (error, numberRowModified) {
                    if (error) {
                        console.log("FAILED " + toInsert.website);
                        console.log("ERROR: " + error);
                        console.log("ERROR: " + ++errorNum);
                    }
                });
            }
        });
    };

    return Feed;
});





