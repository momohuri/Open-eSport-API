define([], function () {
    return function (self, feedArticle) {


        var cleanArticle = {};
        if (this.website === "Millenium") {
            cleanArticle.pubDate = moment().toDate();
        }

        if (self.website === "Esport Actu" || self.website === "Millenium" || self.website === "Team aAa") {
            cleanArticle.title = feedArticle.title;
            cleanArticle.titleDate = feedArticle.titleDate;
            cleanArticle.category = feedArticle.category;
            cleanArticle.author = self.setAuthor(feedArticle);
            cleanArticle.pubDate = self.setPubDate(feedArticle);
            cleanArticle.link = self.setUrl(feedArticle);
            return   cleanArticle;

        } else {
            cleanArticle.title = feedArticle.title;
            cleanArticle.titleDate = feedArticle.titleDate;
            cleanArticle.category = feedArticle.category;
            cleanArticle.author = self.setAuthor(feedArticle);
            cleanArticle.pubDate = self.setPubDate(feedArticle);
            cleanArticle.link = self.setUrl(feedArticle);
            return cleanArticle
        }
    }
})
;