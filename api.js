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

	return{

		findAll: function(req, res){
			var websites = ["eSportsFrance", "O Gaming", "Team aAa", "Millenium", "VaKarM", "HLTV", "Reddit", "TeamLiquid", "Cadred", "IEWT"];
			getArticlesFromWebsites(websites, function(articles){
				res.send(articles);
			});
		},

		findByLanguage: function(req, res) {
			var websitesFR = ["eSportsFrance", "O Gaming", "Team aAa", "Millenium", "VaKarM"];
			var websitesEN = ["HLTV", "Reddit", "TeamLiquid", "Cadred"];
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
			db.collection('articles').find({website: req.params.website}).sort({ pubDate: -1 }).limit(20).toArray(function(err, articles){
				if(!err) res.send(articles);
			});
		},

		findByGame: function(req, res) {
			db.collection('articles').find({categories: req.params.game}).sort({ pubDate: -1 }).limit(60).toArray(function(err, articles){
				if(!err) res.send(articles);
			});
		},

		findByWebsiteAndGame: function(req, res) {
			db.collection('articles').find({website: req.params.website, categories: req.params.game}).sort({ pubDate: -1 }).limit(20).toArray(function(err, articles){
				if(!err) res.send(articles);
			});
		},


		removeAll: function(req, res) {
			db.collection('articles').remove({ website: "Reddit" });
			res.send(200);
		}

	}

});
