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
app.get('/langue/:lang', api.findByLanguage);
app.get('/website/:website', api.findByWebsite);
app.get('/game/:game', api.findByGame);
app.get('/duo/:website/:game', api.findByWebsiteAndGame);

app.listen();


//CRON
var cronJob = require('cron').CronJob;
new cronJob('0 */5 * * * *', function(){
	console.log('Hi Cron');

	getRssFeed("eSportsFrance", "esfr", "http://www.esportsfrance.com/rss/esports.rss", "fr", null);
	getRssFeed("O'Gaming", "ogaming", "http://www.ogaming.tv/rss.xml", "fr", null);
	getRssFeed("Team aAa", "teamaaa", "http://www.team-aaa.com/xml/news-rss-all.xml", "fr", null);
	getRssFeed("TeamLiquid", "tl", "http://www.teamliquid.net/rss/news.xml", "en", null);
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
}, null, true);



//Parse RSS
function getRssFeed(website, websiteShort, feedUrl, language, game){
	request(feedUrl)
		.pipe(new FeedParser())
		.on('error', function(error) {
			console.error(error);
		})
		.on('article', function(article) {
			generateArticle(article, website, websiteShort, language, game);
		})
		.on('end', function () {
			// do the next thing
		});
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
			
			//console.log(JSON.stringify(article));
			
			//parse title esfr
			if(website == "eSportsFrance"){
				var titleSplit 		= article.title.split(" ");
				titleSplit[0] 		= titleSplit[0].replace("[", "");
				titleSplit[0]		= titleSplit[0].replace("]", "");
				
				article.category 	= titleSplit[0];
				article.title 		= titleSplit[1];
			}

			var categories = [];

			//set categories
			if(game == null){
				if(typeof article.category != 'undefined')
					categories = tools.setCategories(article.category);
				else
					//console.log(article.categories.toString());
					categories = tools.setCategories(article.categories);
				
				if(categories.length < 1 )
					categories.push(websiteShort);
			}
			else
				categories.push(game);

			//set pubDate
			//console.log("pubdate: " + moment(article.pubDate).isValid());
			var pubDate = moment(article.pubDate).toDate();

			//set content
			if(website == "IEWT")
				article.description = article['content:encoded']['#'];

			//set author
			if(website == "Millenium")
				article.author = "Millenium";

			//save to bdd
			db.collection('articles').save({ 
				title: 			article.title, 
				website: 		website,
				categories: 	categories,
				link: 			article.link,
				description: 	article.description,
				pubDate: 		pubDate,
				author: 		article.author,
				language: 		language,
				titleDate: 		articleTitleDate
			});

			console.log("website: " + website + ", title: " + article.title);
		}
		else if(articleFound) {
			console.log("already in DB");
		}
	});
	
}