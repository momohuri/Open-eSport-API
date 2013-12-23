define(['request', 'moment', 'cheerio'], function(request, moment, cheerio){

    function Website(website, websiteShort, url, language, game){
        this.website = website;
        this.websiteShort = websiteShort;
        this.url = url;
        this.language = language;
        this.game = game;
        if(this.website === 'Thunderbot')
            this.getArticlesThunderbot();
        else if(this.website === 'dota2fr')
            this.getArticlesDota2fr();
        else if(this.website === 'Esports Heaven')
            this.getArticlesEsportsHeaven();
    }


    Website.prototype.getArticlesThunderbot = function(){
        var self = this;
        request(this.url, function(err, resp, body){
            $ = cheerio.load(body);
            var links = $('.article>a.title_thunder');
            var dates = $('.article .meta').text();
            dates = dates.replace(/\s+/, '').replace(/(\t|\b|\r)/gm, '');
            arrayDatesAuthors = dates.split(/\n/);
            $(links).each(function(i, linkO){
                var article = {};
                article.title = $(linkO).text().replace(/\s+/, '').replace(/(\r?\n|\t|\b|\n|\r)/gm, '');
                var lastIndex = article.title.lastIndexOf(" ");
                article.title = article.title.substring(0, lastIndex);
                article.link = self.url + $(linkO).attr('href');
                article.author = arrayDatesAuthors[i*3+1];
                var dateArray = arrayDatesAuthors[i*3].substr(1, arrayDatesAuthors[i*3].length);
                dateArray = dateArray.substr(dateArray.indexOf(" ") + 1);
                var currentHour = moment().format('H:mm:ss', 'fr');
                article.pubDate = moment(dateArray + " " + currentHour, 'DD MMM YYYY H:mm:ss', 'fr').toDate();
                article.titleDate = article.title + "-" + article.link;
                self.checkIfAlreadyExist(article, function(){
                    self.saveArticle(article, self.website, self.language, self.game);
                });
            });
        });
    }

    Website.prototype.getArticlesDota2fr = function(){
        var self = this;
        request(this.url, function(err, resp, body){
            $ = cheerio.load(body);
            var links = $('.intro>h3>a');
            var dates = $('.intro>.date');
            $(links).each(function(i, content){
                var article = {};
                article.title = $(content).text();
                article.link = "http://www.dota2.fr" + $(content).attr('href');
                var date = dates[i].children[0].data;
                var currentHour = moment().format('H:mm:ss', 'fr');
                article.pubDate = moment(date + " " + currentHour, 'DD MMM YYYY H:mm:ss', 'fr').toDate();
                article.titleDate = article.title + "-" + article.link;
                self.checkIfAlreadyExist(article, function(){
                    self.saveArticle(article, self.website, self.language, self.game);
                });
            });
        });
    }

    Website.prototype.getArticlesEsportsHeaven = function(){
        var self = this;
        request(this.url, function(err, resp, body){
            $ = cheerio.load(body);
            var subLinks = $('.list-headlines>.item>.title>a');
            var subDates = $('.list-headlines>.item .date');
            var subAuthors = $('.list-headlines>.item .author');

            $(subLinks).each(function(i, content){
                var article = {};
                article.title = $(content).text();
                article.link = "http://www.esportsheaven.com" + $(content).attr('href');
                article.author = subAuthors[i].children[0].data;
                var date = subDates[i].children[0].data;

                if(date.indexOf('today') > -1){
                    date = date.split(",");
                    article.pubDate = moment(date[1], 'H:mm').toDate();
                }
                else if(date.indexOf('yesterday') > -1){
                    date = date.split(",");
                    article.pubDate = moment(date[1], 'H:mm').subtract('days', 1).toDate();
                }
                else{
                    article.pubDate = moment(date, 'DD MMM YYYY, H:mm', 'en').toDate();
                }

                article.titleDate = article.title + "-" + article.link;

                self.checkIfAlreadyExist(article, function(){
                    self.saveArticle(article, self.website, self.language, self.game);
                });
            });

            var headLinks = $('.headlines>.body>.filter_feature>h1>a');
            var headDates = $('.headlines>.body>.filter_feature .date');
            var headAuthors = $('.headlines>.body>.filter_feature .author');

            $(headLinks).each(function(i, content){
                var article = {};
                article.title = $(content).text();
                article.link = "http://www.esportsheaven.com" + $(content).attr('href');
                article.author = headAuthors[i].children[0].data;
                var date = headDates[i].children[0].data;

                if(date.indexOf('today') > -1){
                    date = date.split(",");
                    article.pubDate = moment(date[1], 'H:mm').toDate();
                }
                else if(date.indexOf('yesterday') > -1){
                    date = date.split(",");
                    article.pubDate = moment(date[1], 'H:mm').subtract('days', 1).toDate();
                }
                else{
                    article.pubDate = moment(date, 'DD MMM YYYY, H:mm', 'en').toDate();
                }

                article.titleDate = article.title + "-" + article.link;

                self.checkIfAlreadyExist(article, function(){
                    self.saveArticle(article, self.website, self.language, self.game);
                });
            });
            
        });
    }

    Website.prototype.checkIfAlreadyExist = function(article, callback){
        var self = this;
        db.collection('articles').findOne({
            titleDate: article.titleDate
        }, function(error, articleFound){
            if(error) console.log("Error");
            else if(!articleFound || typeof articleFound === 'undefined'){
                callback();
            }
        });
    }

    Website.prototype.saveArticle = function(article, website, language, game){
        db.collection('articles').insert({ 
            title:          article.title, 
            website:        website,
            category:       game,
            link:           article.link,
            pubDate:        article.pubDate,
            author:         article.author,
            language:       language,
            titleDate:      article.titleDate
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
                console.log("new article from " + website + ": " + saved[0].title);
            }
        }
        );
    } 

    return Website;
});
