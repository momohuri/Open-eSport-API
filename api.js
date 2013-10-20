var mongoConfig		= require('./mongoconfig');
var db 				= mongoConfig.db;

exports.findByLanguage = function(req, res) {
	var websitesFR = ["eSportsFrance", "O Gaming", "Team aAa", "Millenium", "VaKarM"];
	var websitesEN = ["HLTV", "Reddit", "TeamLiquid", "Cadred"];
	var allArticles = [];
	var count = 0;
	if(req.params.lang == "fr"){
		for(var i = 0 ; i < websitesFR.length ; i++){
			db.collection('articles').find({ website: websitesFR[i] }).sort({ pubDate: -1 }).limit(40).toArray(function(err, articles){
				if(!err) {
					count++;
					allArticles = allArticles.concat(articles);
					if(count == websitesFR.length){
						count = 0;
						showArticles(res, allArticles);
					}
				}
			});
		}
	}
	else if(req.params.lang == "en"){
		for(var i = 0 ; i < websitesEN.length ; i++){
			db.collection('articles').find({ website: websitesEN[i] }).sort({ pubDate: -1 }).limit(40).toArray(function(err, articles){
				if(!err) {
					count++;
					allArticles = allArticles.concat(articles);
					if(count == websitesEN.length){
						count = 0;
						showArticles(res, allArticles);
					}
				}
			});
		}
	}
};

exports.findByWebsite = function(req, res) {
	db.collection('articles').find({website: req.params.website}).sort({ pubDate: -1 }).limit(20).toArray(function(err, articles){
		if(!err) res.send(articles);
	});
};

exports.findByGame = function(req, res) {
	db.collection('articles').find({categories: req.params.game}).sort({ pubDate: -1 }).limit(60).toArray(function(err, articles){
		if(!err) res.send(articles);
	});
};

exports.findByWebsiteAndGame = function(req, res) {
	db.collection('articles').find({website: req.params.website, categories: req.params.game}).sort({ pubDate: -1 }).limit(20).toArray(function(err, articles){
		if(!err) res.send(articles);
	});
};

exports.findAll = function(req, res){
	var websites = ["eSportsFrance", "O Gaming", "Team aAa", "Millenium", "VaKarM", "HLTV", "Reddit", "TeamLiquid", "Cadred", "IEWT"];
	var allArticles = [];
	var count = 0;
	for(var i = 0 ; i < websites.length ; i++){
		db.collection('articles').find({ website: websites[i] }).sort({ pubDate: -1 }).limit(40).toArray(function(err, articles){
			if(!err) {
				count++;
				allArticles = allArticles.concat(articles);
				if(count == websites.length){
					count = 0;
					showArticles(res, allArticles);
				}
			}
		});
	}
};

exports.removeAll = function(req, res) {
	db.collection('articles').remove();
	res.send(200);
};

var showArticles = function(res, articles){
	res.send(articles);
}