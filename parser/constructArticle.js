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
                var LatLong = function () {
                    var extra = {
                        formatter: null
                    };
                    var geocoderProvider = 'datasciencetoolkit';
                    var httpAdapter = 'http';
                    var geocoder = require('node-geocoder').getGeocoder(geocoderProvider, httpAdapter, extra);
                    geocoder.geocode(addr.street + ' ' + addr.city + ' ' + addr.region + ' ' + addr.country, function (err, res) {
                            if (res !== undefined && res.length !== 0) {
                                res[0].geo = {
                                    type: "Point",
                                    coordinates: [res[0].latitude, res[0].longitude]
                                };
                                delete res[0].latitude;
                                delete res[0].longitude;
                                next(res[0]);
                            } else {
                                next(addr);
                            }

                        }
                    );
                };
                LatLong();

            }
        }
        ;

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
            next(article);
        });


    };
})
;


Object.prototype.removeNulls = function () {
    var obj = this;
    var isArray = obj instanceof Array;
    for (var k in obj) {
        if (obj[k] === null) isArray ? obj.splice(k, 1) : delete obj[k];
        else if (typeof obj[k] == "object") obj[k].removeNulls();
    }
}