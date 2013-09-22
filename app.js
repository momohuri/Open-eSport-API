console.log("bonjour!");
//Modules
var FeedParser 		= require('feedparser'); 
var	request			= require('request');
var moment 			= require('moment');
var express 		= require('express');
console.log("2bonjour!");

//Files
var tools 			= require('./tools');
var api 			= require('./api');
console.log("3bonjour!");

var mongoConfig		= require('./mongoconfig');

console.log("4bonjour!");

var db 				= mongoConfig.db;
console.log("5bonjour!");
var app 			= express();
console.log("6bonjour!");

//API config
app.get('/langue/:lang', api.findByLanguage);
app.get('/website/:website', api.findByWebsite);
app.get('/game/:game', api.findByGame);
app.get('/duo/:website/:game', api.findByWebsiteAndGame);
app.get('/remove/all', api.removeAll);
console.log("7bonjour!");

app.listen();
console.log("8bonjour!");

// var Iconv = require('iconv').Iconv;
// var iconv = new Iconv('ISO-8859-1', 'utf-8');

//CRON
var cronJob = require('cron').CronJob;
new cronJob('* */4 * * * *', function(){
	console.log('Hi Cron');

	getRssFeed("eSportsFrance", "esfr", "http://www.esportsfrance.com/rss/esports.rss", "fr", null);
	getRssFeed("O'Gaming", "ogaming", "http://www.ogaming.tv/rss.xml", "fr", null);
	getRssFeed("Team aAa", "teamaaa", "http://www.team-aaa.com/xml/news-rss-all.xml", "fr", null);
	getRssFeed("TeamLiquid", "tl", "http://www.teamliquid.net/rss/news.xml", "en", null);
	getRssFeed("VaKarM", "vakarm", "http://feeds2.feedburner.com/vakarm", "fr", "csgo");
	getRssFeed("HLTV", "hltv", "http://www.hltv.org/news.rss.php", "en", "csgo");
	getRssFeed("Cadred", "cadred", "http://www.cadred.org/Rss/?type=news", "en", null);
	// getRssFeed("IEWT", "iewt", "http://www.inesportwetrust.com/feed", "fr", null);
	getRssFeed("Reddit", "reddit", "http://www.reddit.com/r/starcraft/.rss", "en", "sc2");
	getRssFeed("Reddit", "reddit", "http://www.reddit.com/r/dota2/.rss", "en", "dota2");
	getRssFeed("Reddit", "reddit", "http://www.reddit.com/r/leagueoflegends/.rss", "en", "lol");
	getRssFeed("Millenium", "millenium", "http://www.millenium.org/index.php?siteUrl=starcraft-2&themeUrl=accueil&module=actualite&action=actualite:rss", "fr", "sc2");
	getRssFeed("Millenium", "millenium", "http://www.millenium.org/index.php?siteUrl=dota-2&themeUrl=accueil&module=actualite&action=actualite:rss", "fr", "dota2");
	getRssFeed("Millenium", "millenium", "http://www.millenium.org/index.php?siteUrl=lol&themeUrl=accueil&module=actualite&action=actualite:rss", "fr", "lol");
	getRssFeed("Millenium", "millenium", "http://www.millenium.org/index.php?siteUrl=cs-go&themeUrl=accueil&module=actualite&action=actualite:rss", "fr", "csgo");
}, null, true);

console.log("9bonjour!");

//Parse RSS
function getRssFeed(website, websiteShort, feedUrl, language, game){
	// if(website == "eSportsFrance"){
	// 	request(feedUrl)
	// 		.pipe(iconv)
	// 		.pipe(new FeedParser())
	// 		.on('error', function(error) {
	// 			console.error(error);
	// 		})
	// 		.on('article', function(article) {
	// 			generateArticle(article, website, websiteShort, language, game);
	// 		})
	// 		.on('end', function () {
	// 			// do the next thing
	// 		});
	// }
	// else{
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
	// }
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
			
			// if(website == "eSportsFrance"){
			// 	var id_url = article.link.split("/");
			// 	id_url = id_url[5].split("-");

			// }
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
				category: 		category,
				link: 			article.link,
				description: 	article.description,
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