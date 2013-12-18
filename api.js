var websites = ["O Gaming", "Team aAa", "Millenium", "VaKarM", "HLTV", "Reddit", "Esport Actu",
				"dota2fr", "TeamLiquid", "IEWT", "Thunderbot", "onGamers", "SK Gaming", "joinDOTA", 
				"Esports Express", "Esports Heaven", "ESReality", "Shoryuken"];

var websitesFR = ["O Gaming", "Team aAa", "Millenium", "Esport Actu", "VaKarM", "Thunderbot", "IEWT", "dota2fr"];

var websitesEN = ["HLTV", "Reddit", "TeamLiquid", "onGamers", "SK Gaming", "joinDOTA", "Esports Express", "Esports Heaven", "ESReality", "Shoryuken"];

var games = ["sc2", "lol", "dota2", "csgo", "versus", "ql", "hearthstone"];

define([], function(){

	function getArticlesFromWebsites(websites, callback){
		var allArticles = [];
		var count = 0;
		
		for(var i = 0 ; i < websites.length ; i++){
			var gamesCount = 0;

			db.collection('articles').find({ $and: [{ website: websites[i] }, { category: { $nin: games } } ] }).sort({ pubDate: -1 }).limit(8).toArray(function(err, articles){
				gamesCount++;
				if(!err) {
					allArticles = allArticles.concat(articles);
					
					if(gamesCount == games.length + 1){
						count++;
						gamesCount = 0;
					}

					if(count == websites.length){
						count = 0;
						callback(allArticles);
					}
					
				}
			});

			for(var j = 0 ; j < games.length ; j++){
				db.collection('articles').find({ $and: [{ website: websites[i] }, { category: games[j] }] }).sort({ pubDate: -1 }).limit(8).toArray(function(err, articles){
					gamesCount++;
					if(!err) {
						allArticles = allArticles.concat(articles);
						
						if(gamesCount == games.length + 1){
							count++;
							gamesCount = 0;
						}

						if(count == websites.length){
							count = 0;
							callback(allArticles);
						}
						
					}
				});
			}
			// else{
			// 	db.collection('articles').find({ website: websites[i] }).sort({ pubDate: -1 }).limit(40).toArray(function(err, articles){
			// 		if(!err) {
			// 			count++;
			// 			allArticles = allArticles.concat(articles);
			// 			if(count == websites.length){
			// 				count = 0;
			// 				callback(allArticles);
			// 			}
			// 		}
			// 	});
			// }
		}
	};

	function getArticlesFromWebsitesAndGame(websites, game, callback){
		var allArticles = [];
		var count = 0;
		
		for(var i = 0 ; i < websites.length ; i++){
			if(game === 'others'){
				db.collection('articles').find({ $and: [{ website: websites[i] }, { category: { $nin: games } }] }).sort({ pubDate: -1 }).limit(40).toArray(function(err, articles){
					if(!err) {
						count++;
						allArticles = allArticles.concat(articles);
						if(count == websites.length){
							count = 0;
							callback(allArticles);
						}
					}
				});
			}
			else{
				db.collection('articles').find({ $and: [{ website: websites[i] }, { category: game } ]}).sort({ pubDate: -1 }).limit(40).toArray(function(err, articles){
					if(!err) {
						count++;
						allArticles = allArticles.concat(articles);
						if(count == websites.length){
							count = 0;
							callback(allArticles);
						}
					}
				});
			}
		}
	};

	return{

		findAll: function(req, res){
			getArticlesFromWebsites(websites, function(articles){
				res.send(articles);
			});
		},

		findAllMobile: function(req, res){
			var websites = ["O Gaming", "Team aAa", "Millenium", "VaKarM", "HLTV", "Reddit", "Esport Actu",
							"dota2fr", "TeamLiquid", "IEWT", "Thunderbot", "onGamers", "SK Gaming", "joinDOTA", "Esports Express", "Esports Heaven", "ESReality", "Shoryuken"];
			
			getArticlesFromWebsites(websites, function(articles){
				var count = 0;
		
				for(var i = 0 ; i < articles.length ; i++){
					count++;
					if(articles[i].category === "versus")
						articles[i].category = "sf4";

					if(count == articles.length){
						count = 0;
						res.send(articles);
					}
				}

			});
		},

		findByLanguage: function(req, res) {
			if(req.params.lang == "fr"){
				getArticlesFromWebsites(websitesFR, function(articles){
					res.send(articles);
				});
			}
			else if(req.params.lang == "en"){
				getArticlesFromWebsites(websitesEN, function(articles){
					res.send(articles);
				});
			}
		},

		findByWebsite: function(req, res) {
			db.collection('articles').find({website: req.params.website}).sort({ pubDate: -1 }).limit(40).toArray(function(err, articles){
				if(!err) res.send(articles);
			});
		},

		findByGame: function(req, res) {
			getArticlesFromWebsitesAndGame(websites, req.params.game, function(articles){
				res.send(articles);
			});
		},

		findByWebsiteAndGame: function(req, res) {
			db.collection('articles').find({website: req.params.website, category: req.params.game}).sort({ pubDate: -1 }).limit(40).toArray(function(err, articles){
				if(!err) res.send(articles);
			});
		},


		removeAll: function(req, res) {
			db.collection('articles').remove({ website: "Shoryuken" });
			res.send(200);
		}

	}

});
