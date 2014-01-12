define([], function () {

    var setters = {
        setCategory: function (feedParams, article) {
            var category = null;

            if (feedParams.game == null) {
                if (article.category !== undefined)
                    category = this.setCategoryGame(feedParams,article.category);
                else
                    category = this.setCategoryGame(feedParams,article.categories);
                if (category == null)
                    category = feedParams.websiteShort;
            }
            else
                category = feedParams.game;

            return category
        },
        setCategoryGame: function (feedParams,cat) {

            // c un peu chelou ici car cat un array, donc fair un toString dessus?
            var category;
            if ((cat.toString().toLowerCase().indexOf("starcraft") > -1) || (cat.toString().toLowerCase().indexOf("sc2") > -1))
                category = "sc2";
            if ((cat.toString().toLowerCase().replace(" ", "").indexOf("dota2") > -1) || (cat.toString().toLowerCase().indexOf("defense of the ancients") > -1))
                category = "dota2";
            if ((cat.toString().toLowerCase().indexOf("lol") > -1) || (cat.toString().toLowerCase().indexOf("league of legends") > -1))
                category = "lol";
            if ((cat.toString().toLowerCase().indexOf("csgo") > -1) || (cat.toString().toLowerCase().indexOf("counter-strike") > -1))
                category = "csgo";
            if ((cat.toString().toLowerCase().indexOf("ql") > -1) || (cat.toString().toLowerCase().indexOf("quake") > -1))
                category = "ql";
            if ((cat.toString().toLowerCase().indexOf("hearthstone") > -1))
                category = "hearthstone";
            if ((cat.toString().toLowerCase().indexOf("sf4") > -1) || (cat.toString().toLowerCase().indexOf("street fighter") > -1) ||
                (cat.toString().toLowerCase().indexOf("baston") > -1))
                category = "versus";

            return category;
        },
        setAuthor: function (feedParams, author) {
            if (feedParams.website === "Millenium" || feedParams.website === "Team aAa" || feedParams.website === "SK Gaming")
                return feedParams.website;
            else
                return author;
        },
        setPubDate: function (feedParams, pubDate) {

            if (feedParams.website === "Millenium") {
                pubDate = moment().toDate();
            }
            else if (feedParams.website === "Team aAa")
                pubDate = moment(pubDate).add('hours', 2).toDate();
            else
                pubDate = moment(pubDate).toDate();

            return pubDate;
        },
        setUrl: function (feedParams, link) {
            if (feedParams.website === "Reddit")
                return link + ".compact";
            else
                return link;
        }
    };

    return setters;
});