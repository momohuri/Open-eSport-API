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
        switch (this.type) {
            case 'api':
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
                            for(var i =0;i<result.length;i++){
                                eachArticle(result[i]);
                            }
                        }


                    })
                }).on('error', function (e) {
                        console.log("Got error: " + e.message);
                    });

                break;
            case 'feed':
                request(this.url).pipe(new FeedParser()).on('error',function (error) {
                    console.error(self.website + ": " + error);
                }).on('readable', function () {
                        var stream = this, item;
                        while (feedArticle = stream.read()) {
                            eachArticle(feedArticle);
                        }
                    });
                break;

        }


        function eachArticle(article) {
            var date;
            if (article["xcal:dtstart"] !== undefined) date= new Date(article["xcal:dtstart"][1]['#']);
            if (article.event_date !== undefined) date= new Date(article.event_date);

            if (article !== undefined && date>new Date()) {
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
        if (feedArticle.url !== undefined) url = feedArticle.url;
        if (feedArticle.genreUrlPath !== undefined) url = feedArticle.genreUrlPath+'/'+feedArticle.urlpath;
        dbCheck.collection('articles2').findOne({url: url }, function (err, doc) {
            if (err) throw err;
            next(doc !== null);
        });
    };

    Feed.prototype.saveArticle = function (article) {
        var toInsert = article;
        toInsert.language = this.language;
        toInsert.website = this.website;
        dbCheck.collection('articles2').insert(toInsert, function (error, numberRowModified) {
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
