define([], function(){

	function getArticlesFromWebsites(websites, callback){
		var allArticles = [];
		var count = 0;
		
		for(var i = 0 ; i < websites.length ; i++){
			db.collection('articles').find({ website: websites[i] }).sort({ pubDate: -1 }).limit(40).toArray(function(err, articles){
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
	};

	function getArticlesFromWebsitesAndGame(websites, game, callback){
		var allArticles = [];
		var count = 0;
		
		for(var i = 0 ; i < websites.length ; i++){
			if(game === 'others'){
				db.collection('articles').find({ $and: [{ website: websites[i] }, { category: { $ne: 'lol' } }, { category: { $ne: 'sc2' } }, { category: { $ne: 'dota2' } }, { category: { $ne: 'csgo' } }] }).sort({ pubDate: -1 }).limit(40).toArray(function(err, articles){
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
			var websites = ["O Gaming", "Team aAa", "Millenium", "VaKarM", "HLTV", "Reddit", "Esport Actu",
							"dota2fr", "TeamLiquid", "IEWT", "Thunderbot", "onGamers", "SK Gaming", "joinDOTA", "Esports Express", "Esports Heaven"];
			getArticlesFromWebsites(websites, function(articles){
				res.send(articles);
			});
		},

		findByLanguage: function(req, res) {
			var websitesFR = ["O Gaming", "Team aAa", "Millenium", "Esport Actu", "VaKarM", "Thunderbot", "IEWT", "dota2fr"];
			var websitesEN = ["HLTV", "Reddit", "TeamLiquid", "onGamers", "SK Gaming", "joinDOTA", "Esports Express", "Esports Heaven"];
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
			var websites = ["O Gaming", "Team aAa", "Millenium", "VaKarM", "Esport Actu", "HLTV", "Reddit", "TeamLiquid"
							, "IEWT", "Thunderbot", "onGamers", "SK Gaming", "joinDOTA", "dota2fr", "Esports Express", "Esports Heaven"];
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
			db.collection('articles').remove({ website: "Esports Heaven" });
			res.send(200);
		}

	}

});
