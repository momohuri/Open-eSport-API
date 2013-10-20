//Modules
var FeedParser 		= require('feedparser'); 
var	request			= require('request');
var moment 			= require('moment');
var express 		= require('express');

//Files
var tools 			= require('./tools');
var api 			= require('./api');

var mongoConfig		= require('./mongoconfig');


var db 				= mongoConfig.db;
var app 			= express();

//API config
app.get('/lang/:lang', api.findByLanguage);
app.get('/website/:website', api.findByWebsite);
app.get('/game/:game', api.findByGame);
app.get('/duo/:website/:game', api.findByWebsiteAndGame);
app.get('/posts/all/', api.findAll);
app.get('/remove/all', api.removeAll);

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});

var Iconv = require('iconv').Iconv;
var iconv = new Iconv('ISO-8859-1', 'utf-8');

//CRON
var cronJob = require('cron').CronJob;
new cronJob('0 * * * * *', function(){
	console.log("cron launch");
	launchFeeds();
}, null, true);


function launchFeeds(){
	// getRssFeed("eSportsFrance", "esportsfrance", "http://www.esportsfrance.com/rss/esports.rss", "fr", null);
	getRssFeed("O Gaming", "ogaming", "http://www.ogaming.tv/rss.xml", "fr", null);
	getRssFeed("Team aAa", "teamaaa", "http://www.team-aaa.com/xml/news-rss-all.xml", "fr", null);
	getRssFeed("TeamLiquid", "teamliquid", "http://www.teamliquid.net/rss/news.xml", "en", null);
	getRssFeed("VaKarM", "vakarm", "http://feeds2.feedburner.com/vakarm", "fr", "csgo");
	getRssFeed("HLTV", "hltv", "http://www.hltv.org/news.rss.php", "en", "csgo");
	getRssFeed("Cadred", "cadred", "http://www.cadred.org/Rss/?type=news", "en", null);
	getRssFeed("IEWT", "iewt", "http://www.inesportwetrust.com/feed", "fr", null);
	getRssFeed("Reddit", "reddit", "http://www.reddit.com/r/starcraft/.rss", "en", "sc2");
	getRssFeed("Reddit", "reddit", "http://www.reddit.com/r/dota2/.rss", "en", "dota2");
	getRssFeed("Reddit", "reddit", "http://www.reddit.com/r/leagueoflegends/.rss", "en", "lol");
	getRssFeed("Millenium", "millenium", "http://www.millenium.org/index.php?siteUrl=starcraft-2&themeUrl=accueil&module=actualite&action=actualite:rss", "fr", "sc2");
	getRssFeed("Millenium", "millenium", "http://www.millenium.org/index.php?siteUrl=dota-2&themeUrl=accueil&module=actualite&action=actualite:rss", "fr", "dota2");
	getRssFeed("Millenium", "millenium", "http://www.millenium.org/index.php?siteUrl=lol&themeUrl=accueil&module=actualite&action=actualite:rss", "fr", "lol");
	getRssFeed("Millenium", "millenium", "http://www.millenium.org/index.php?siteUrl=cs-go&themeUrl=accueil&module=actualite&action=actualite:rss", "fr", "csgo");
}

//Parse RSS
function getRssFeed(website, websiteShort, feedUrl, language, game){
	if(website == "eSportsFrance"){
		request(feedUrl)
			.pipe(iconv)
			.pipe(new FeedParser())
			.on('error', function(error) {
				console.error(website + ": " + error);
			})
			.on('article', function(article) {
				generateArticle(article, website, websiteShort, language, game);
			})
			.on('end', function () {
				// do the next thing
			});
	}
	else{
		request(feedUrl)
			.pipe(new FeedParser())
			.on('error', function(error) {
				console.error(website + ": " + error);
			})
			.on('article', function(article) {
				generateArticle(article, website, websiteShort, language, game);
			})
			.on('end', function () {
				// do the next thing
			});
	}
	// for(i = 0 ; i < rssArray.length ; i++){
	//   		console.log(rssArray[i].link);
	//   	}
};

function generateArticle(article, website, websiteShort, language, game){
	var articleTitleDate = article.title + "-" + article.pubDate;
	db.collection('articles').findOne({
		titleDate: articleTitleDate
	}, function(error, articleFound){
		if(error) console.log("Error");
		else if(!articleFound || typeof articleFound == 'undefined'){
			
			var id_url = null;

			if(website == "eSportsFrance"){
				id_url = article.link.split("/");
				id_url = id_url[5].split("-");
				id_url = id_url[0];

			}
			if(website == "Millenium"){
				id_url = article.link.split("-");
				id_url = id_url[id_url.length-1];
			}
			if(website == "Team aAa"){
				id_url = article.link.split("/");
				id_url = id_url[3].split("-");
				id_url = id_url[1];
			}

			if(id_url != null){
				var likeTitle = ".*" + id_url + ".*";
				db.collection('articles').find({website: website}).toArray(function(err, articlesDuplicate){
					articlesDuplicate.forEach(function(articleDuplicate){
						if(articleDuplicate.link.indexOf(id_url) != -1){
							db.collection('articles').remove({link: articleDuplicate.link})
						}
					})
				})
			}

			//Suppression des articles avec le même URL
			db.collection('articles').remove({
				link: article.link
			});


			//console.log(JSON.stringify(article));
			
			//parse title esfr
			if(website == "eSportsFrance"){
				var titleSplit 		= article.title.split(" ");
				article.title 		= titleSplit.slice(1).join(" ");
				titleSplit[0] 		= titleSplit[0].replace("[", "");
				titleSplit[0]		= titleSplit[0].replace("]", "");
				
				article.category 	= titleSplit[0];
			}

			var category = null;

			//set categories
			if(game == null){
				if(typeof article.category != 'undefined')
					category = tools.setCategories(article.category);
				else
					category = tools.setCategories(article.categories);
				
				if(category == null)
					category = websiteShort;
			}
			else
				category = game;

			//set pubDate
			//console.log("pubdate: " + moment(article.pubDate).isValid());
			var pubDate = moment(article.pubDate).toDate();


			//set author
			if(website === "Millenium" || website === "Team aAa")
				article.author = website;

			//save to bdd
			db.collection('articles').save({ 
				title: 			article.title, 
				website: 		website,
				category: 		category,
				link: 			article.link,
				pubDate: 		pubDate,
				author: 		article.author,
				language: 		language,
				titleDate: 		articleTitleDate
			});
		}
		else if(articleFound) {
		}
	});
	
}