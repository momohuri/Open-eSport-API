define(['node-geocoder'], function (geocoder) {

    var setters = {


        setPlace: function (adr, next) {
            var addr = {
                city: adr['xcal:x-calconnect-city'] ? adr['xcal:x-calconnect-city']['#'] : null,
                country: adr['xcal:x-calconnect-country'] ? adr['xcal:x-calconnect-country']['#'] : null,
                region: adr['xcal:x-calconnect-region'] ? adr['xcal:x-calconnect-region']['#'] : null,
                street: adr['xcal:x-calconnect-street'] ? adr['xcal:x-calconnect-street']['#'] : null,
                name: adr['xcal:x-calconnect-venue-name'] ? adr['xcal:x-calconnect-venue-name']['#'] : null
            };
            addr.removeNulls();

            var extra = {
                formatter: null
            };
            var geocoderProvider = ['datasciencetoolkit', 'openstreetmap', 'google'];
            var httpAdapter = 'http';
            geocode(0);
            function geocode(i) {
                var geocoder = require('node-geocoder').getGeocoder(geocoderProvider[i], httpAdapter, extra);
                geocoder.geocode(addr.street + ' ' + addr.city + ' ' + addr.region + ' ' + addr.country, function (err, res) {
                        if (res !== undefined && res.length !== 0) {
                            res[0].geo = {
                                type: "Point",
                                coordinates: [res[0].longitude, res[0].latitude]
                            };
                            delete res[0].latitude;
                            delete res[0].longitude;
                            next(res[0]);
                        } else if (++i < geocoderProvider.length) {
                            geocode(i);
                        } else {
                            next(addr);
                        }

                    }
                );
            }

        }
    };

    return function (feedParams, feedArticle, next) {

        setters.setPlace(feedArticle['xcal:x-calconnect-venue']['xcal:adr'], function (addr) {
            var article = {
                title: feedArticle.title,
                categories: feedArticle.categories,
                url: feedArticle["xcal:url"]['#'],
                place: addr,
                startDate: feedArticle["xcal:dtstart"][1]['#'],
                description: feedArticle.description,
                endDate: feedArticle["xcal:dtstart"][2]['#'],
                organizer: feedArticle["xcal:x-calconnect-organizer"] ? feedArticle["xcal:x-calconnect-organizer"]["xcal:x-calconnect-organizer-name"]['#'] : null
            };
            article.removeNulls();
            next(article);
        });


    };
})
;


//I don't want to insert null fiends in mongo
Object.prototype.removeNulls = function () {
    var obj = this;
    var isArray = obj instanceof Array;
    for (var k in obj) {
        if (obj[k] === null || obj[k] === undefined) isArray ? obj.splice(k, 1) : delete obj[k];
        else if (typeof obj[k] == "object") obj[k].removeNulls();
    }
};