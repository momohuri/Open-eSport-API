define(['cron', 'Feed', 'Website'], function(cron, Feed, Website){
	
	return {

		init: function(){
			var self = this;
			var cronJob = cron.CronJob;
			// console.log(cronJob);
    		new cronJob('0 */2 * * * *', function(){
				console.log("launch cron");
				self.launchFeeds();
			}, null, true);
		},

		launchFeeds: function(){
			// new Feed("eSportsFrance", "esportsfrance", "http://www.esportsfrance.com/rss/esports.rss", "fr", null);
			new Website("Thunderbot", "thunderbot", "http://www.thunderbot.gg", "fr", "lol");
			new Feed("O Gaming", "ogaming", "http://www.ogaming.tv/rss.xml", "fr", null);
			new Feed("Team aAa", "teamaaa", "http://www.team-aaa.com/xml/news-rss-all.xml", "fr", null);
			new Feed("TeamLiquid", "teamliquid", "http://www.teamliquid.net/rss/news.xml", "en", null);
			new Feed("VaKarM", "vakarm", "http://feeds2.feedburner.com/vakarm", "fr", "csgo");
			new Feed("HLTV", "hltv", "http://www.hltv.org/news.rss.php", "en", "csgo");
			// new Feed("Cadred", "cadred", "http://www.cadred.org/Rss/?type=news", "en", null);
			new Feed("IEWT", "iewt", "http://www.inesportwetrust.com/feed", "fr", null);
			new Feed("joinDOTA", "joindota", "http://www.joindota.com/feeds/news", "en", "dota2");
			new Feed("Reddit", "reddit", "http://www.reddit.com/r/starcraft/.rss", "en", "sc2");
			new Feed("Reddit", "reddit", "http://www.reddit.com/r/dota2/.rss", "en", "dota2");
			new Feed("Reddit", "reddit", "http://www.reddit.com/r/leagueoflegends/.rss", "en", "lol");
			new Feed("Reddit", "reddit", "http://www.reddit.com/r/GlobalOffensive/.rss", "en", "csgo");
			new Feed("Millenium", "millenium", "http://www.millenium.org/index.php?siteUrl=starcraft-2&themeUrl=accueil&module=actualite&action=actualite:rss", "fr", "sc2");
			new Feed("Millenium", "millenium", "http://www.millenium.org/index.php?siteUrl=dota-2&themeUrl=accueil&module=actualite&action=actualite:rss", "fr", "dota2");
			new Feed("Millenium", "millenium", "http://www.millenium.org/index.php?siteUrl=lol&themeUrl=accueil&module=actualite&action=actualite:rss", "fr", "lol");
			new Feed("Millenium", "millenium", "http://www.millenium.org/index.php?siteUrl=cs-go&themeUrl=accueil&module=actualite&action=actualite:rss", "fr", "csgo");
			new Feed("onGamers", "ongamers", "http://www.ongamers.com/starcraft-2/6000-3/rss/", "en", "sc2");
			new Feed("onGamers", "ongamers", "http://www.ongamers.com/league-of-legends/6000-2/rss/", "en", "lol");
			new Feed("onGamers", "ongamers", "http://www.ongamers.com/dota-2/6000-1/rss/", "en", "dota2");
			new Feed("onGamers", "ongamers", "http://www.ongamers.com/counter-strike-global-offensive/6000-4/rss/", "en", "csgo");
			new Feed("SK Gaming", "skgaming", "http://www.sk-gaming.com/rss/channel/lol", "en", "lol");
			new Feed("SK Gaming", "skgaming", "http://www.sk-gaming.com/rss/channel/sc2", "en", "sc2");
			new Feed("SK Gaming", "skgaming", "http://www.sk-gaming.com/rss/channel/cs", "en", "csgo");
		}
	}
});