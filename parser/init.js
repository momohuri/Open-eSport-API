define([ './Feed', 'fs'], function (Feed, fs) {
    'use strict';
    return {

        init: function () {
            var self = this;
            fs.readFile('./resources/websites.json', 'utf8', function (err, file) {
                if (err) throw err;
                var urls = JSON.parse(file);
                self.launchFeeds(urls);
                console.log("First parse feeds");
                setInterval(function () {
                    console.log("Parse feeds");
                    self.launchFeeds(urls)
                }, 20000000);
            });


        },

        launchFeeds: function (urls) {
            urls.forEach(function (url) {
                new Feed(url)
            });
        }
    }
});