define([], function () {

    function setCategory(self, article) {
        var category = null;

        if (self.game == null) {
            if (typeof article.category != 'undefined')
                category = setCategoryGame(article.category);
            else
                category = setCategoryGame(article.categories);

            if (category == null)
                category = self.websiteShort;
        }
        else
            category = self.game;

        return category
    }

    function setCategoryGame(cat) {
        var category;

        if ((cat.toString().toLowerCase().indexOf("starcraft") > -1) || (cat.toString().toLowerCase().indexOf("sc2") > -1))
            category = "sc2";
        if ((cat.toString().toLowerCase().replace(" ", "").indexOf("dota2") > -1) || (cat.toString().toLowerCase().indexOf("defense of the ancients") > -1))
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

    function setAuthor(self, author) {
        if (self.website === "Millenium" || self.website === "Team aAa" || self.website === "SK Gaming")
            return self.website;
        else
            return author;
    }

    function setPubDate(self, pubDate) {

        if (self.website === "Millenium") {
            pubDate = moment().toDate();
        }
        else if (self.website === "Team aAa")
            pubDate = moment(pubDate).add('hours', 2).toDate();
        else
             pubDate = moment(pubDate).toDate();

        return pubDate;
    }

    function setUrl(self, link) {
        if (self.website === "Reddit")
            return link + ".compact";
        else
            return link;
    }

    function checkIfAlreadyExist(self, article, callback) {
        db.collection('articles').findOne({
            $and: [
                { title: article.title },
                { website: self.website },
                { category: article.category }
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
                        callback();
                    })
                }
                else callback();
            }
        });
    }

    return function (self, feedArticle, callback) {
        feedArticle.category = setCategory(self, feedArticle);
        feedArticle.author = setAuthor(self, feedArticle.author);
        feedArticle.pubDate = setPubDate(self, feedArticle.pubDate);
        feedArticle.link = setUrl(self, feedArticle.link);

        if(self.website === "Esport Actu" || self.website === "Esport Actu" || self.website === "Esport Actu"){
            checkIfAlreadyExist(self, feedArticle, function(){
                callback(feedArticle);
            })
        }
        else callback(feedArticle);
    }
});