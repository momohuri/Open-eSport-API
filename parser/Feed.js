define(['feedparser', 'request', './constructArticle', 'http'], function (FeedParser, request, constructArticle, http) {

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
        switch (this.id) {
            case 'stubhub':
                var buffer = '';
                var first = true;
                http.get(this.url,function (res) {
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
                    console.log("Got error: " + e.message);
                });

                break;
            case 'eventbrite':
                var body = '';
                http.get("http://www.eventbrite.com/json/event_search?app_key=C2IDOBMECGZZUQKLJQ&max=100&region=CA&since_id=9737508149",function (res) {
                    console.log("Got response: " + res.statusCode);
                    res.on('data', function (data) {
                        body += data;
                    });
                    res.on('end', function () {
                        debugger
                        console.log(data);
                        body = JSON.parse(body).events;
                        if (body.length === 101) {
                            console.log('doitagain with since = ' + body[101].event.id);
                        }
                        for (var i = 1; i < body.length; i++) {
                            debugger
                            //todo work from here
                            eachArticle(body[i].event);
                        }
                    });

                }).on('error', function (e) {
                    console.log("Got error: " + e.message);
                });
                break;

        }


        function eachArticle(article) {
            if (self.id === "stubhub" && (article.active != 1 || article.maxPrice === 0)) {
                return;
            }
            var date = constructArticle.setStartDate(article, self.id);
            if (article !== undefined && new Date(date) > new Date()) {
                self.verifyIfExist(article, function (exist) {
                    if (!exist) {
                        constructArticle.setAll(article, self, function (articleConstruct) {
                            self.saveArticle(articleConstruct);
                        });
                    }
                });
            }
        }
    };

    Feed.prototype.verifyIfExist = function (feedArticle, next) {
        var url = constructArticle.setUrl(feedArticle, this.id);
        dbCheck.collection('articles2').findOne({url: url }, function (err, doc) {
            if (err) throw err;
            next(doc !== null);
        });
    };

    Feed.prototype.saveArticle = function (article) {
        var toInsert = article;
        toInsert.language = this.language;
        toInsert.website = this.website;
        dbCheck.collection('articles2').insert({url: article.url}, function (error, numberRowModified) {
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





