define([ './Feed', './Website', 'fs'], function (Feed, Website, fs) {

    return {

        init: function () {
            var self = this;
            self.launchFeeds();
            console.log("First parse feeds");
            setInterval(function () {
                console.log("Parse feeds");
                self.launchFeeds()
            }, 20000);

        },

        launchFeeds: function () {


            fs.readFile('./parser/urls.json', 'utf8', function (err,file) {
                if (err) throw err;
                var urls = JSON.parse(file);
                urls.forEach(function (url) {
                    //le switch case peut etre evite si on fait un constructeur commum pour les deux avec un parametre type
                    switch (url.type) {
                        case 'website':
                            //new Website(url.name, url.shortName, url.url, url.lang, url.game);
                            break;
                        case 'feed':
                            new Feed(url.name, url.shortName, url.url, url.lang, url.game);
                            break;
                    }

                });
            });


//            new Website("Thunderbot", "thunderbot", "http://www.thunderbot.gg", "fr", "lol");
//			new Website("Esports Heaven", "esportsheaven", "http://www.esportsheaven.com/index/filter/LoL", "en", "lol");
//			new Website("Esports Heaven", "esportsheaven", "http://www.esportsheaven.com/index/filter/Starcraft", "en", "sc2");
//			new Website("Esports Heaven", "esportsheaven", "http://www.esportsheaven.com/index/filter/DotA2", "en", "dota2");
//			new Website("Esports Heaven", "esportsheaven", "http://www.esportsheaven.com/index/filter/CSGO", "en", "csgo");
//			new Website("Esports Heaven", "esportsheaven", "http://www.esportsheaven.com/index/filter/HS", "en", "hearthstone");
//			new Feed("O Gaming", "ogaming", "http://www.ogaming.tv/rss.xml", "fr", null);
//			new Feed("Team aAa", "teamaaa", "http://www.team-aaa.com/xml/news-rss-all.xml", "fr", null);
//			new Feed("TeamLiquid", "teamliquid", "http://www.teamliquid.net/rss/news.xml", "en", null);
//			new Feed("VaKarM", "vakarm", "http://feeds2.feedburner.com/vakarm", "fr", "csgo");
//			new Feed("VaKarM", "vakarm", "http://feeds2.feedburner.com/vakarm_coverage", "fr", "csgo");
//			// new Feed("VaKarM", "vakarm", "http://www.vakarm.net/breves.xml", "fr", "csgo");
//			new Feed("HLTV", "hltv", "http://www.hltv.org/news.rss.php", "en", "csgo");
//			new Feed("Esport Actu", "esportactu", "http://www.esportactu.fr/rss.xml", "fr", null);
//			new Feed("dota2fr", "dota2fr", "http://www.dota2.fr/rss/feed/news", "fr", "dota2");
//			new Feed("Shoryuken", "shoryuken", "http://shoryuken.com/feed/", "en", "versus");
//			new Feed("ESReality", "esreality", "http://www.esreality.com/rss_xml.php", "en", "ql");
//			new Feed("IEWT", "iewt", "http://www.inesportwetrust.com/feed", "fr", null);
//			new Feed("joinDOTA", "joindota", "http://www.joindota.com/feeds/news", "en", "dota2");
//			new Feed("Reddit", "reddit", "http://www.reddit.com/r/starcraft/.rss", "en", "sc2");
//			new Feed("Reddit", "reddit", "http://www.reddit.com/r/dota2/.rss", "en", "dota2");
//			new Feed("Reddit", "reddit", "http://www.reddit.com/r/leagueoflegends/.rss", "en", "lol");
//			new Feed("Reddit", "reddit", "http://www.reddit.com/r/GlobalOffensive/.rss", "en", "csgo");
//			new Feed("Reddit", "reddit", "http://www.reddit.com/r/Fighters/.rss", "en", "versus");
//			new Feed("Reddit", "reddit", "http://www.reddit.com/r/quakelive/.rss", "en", "ql");
//			new Feed("Reddit", "reddit", "http://www.reddit.com/r/hearthstone/.rss", "en", "hearthstone");
//			new Feed("Millenium", "millenium", "http://www.millenium.org/index.php?siteUrl=starcraft-2&themeUrl=accueil&module=actualite&action=actualite:rss", "fr", "sc2");
//			new Feed("Millenium", "millenium", "http://www.millenium.org/index.php?siteUrl=dota-2&themeUrl=accueil&module=actualite&action=actualite:rss", "fr", "dota2");
//			new Feed("Millenium", "millenium", "http://www.millenium.org/index.php?siteUrl=lol&themeUrl=accueil&module=actualite&action=actualite:rss", "fr", "lol");
//			new Feed("Millenium", "millenium", "http://www.millenium.org/index.php?siteUrl=cs-go&themeUrl=accueil&module=actualite&action=actualite:rss", "fr", "csgo");
//			new Feed("Millenium", "millenium", "http://www.millenium.org/index.php?siteUrl=hearthstone-heroes-of-warcraft&themeUrl=accueil&module=actualite&action=actualite:rss", "fr", "hearthstone");
//			new Feed("onGamers", "ongamers", "http://www.ongamers.com/starcraft-2/6000-3/rss/", "en", "sc2");
//			new Feed("onGamers", "ongamers", "http://www.ongamers.com/league-of-legends/6000-2/rss/", "en", "lol");
//			new Feed("onGamers", "ongamers", "http://www.ongamers.com/dota-2/6000-1/rss/", "en", "dota2");
//			new Feed("onGamers", "ongamers", "http://www.ongamers.com/counter-strike-global-offensive/6000-4/rss/", "en", "csgo");
//			new Feed("onGamers", "ongamers", "http://www.ongamers.com/hearthstone/6000-7/rss/", "en", "hearthstone");
//			new Feed("onGamers", "ongamers", "http://www.ongamers.com/street-fighter-iv/6000-10/rss/", "en", "versus");
//			new Feed("onGamers", "ongamers", "http://www.ongamers.com/quake/6000-9/rss/", "en", "ql");
//			new Feed("SK Gaming", "skgaming", "http://www.sk-gaming.com/rss/channel/lol", "en", "lol");
//			new Feed("SK Gaming", "skgaming", "http://www.sk-gaming.com/rss/channel/sc2", "en", "sc2");
//			new Feed("SK Gaming", "skgaming", "http://www.sk-gaming.com/rss/channel/cs", "en", "csgo");
//			new Feed("Esports Express", "esportsexpress", "http://esportsexpress.com/feed/", "en", null);
        }
    }
});