define(['node-geocoder'], function (geocoder) {

    var setters = {


        setPlace: function (feedParams, adr, next) {
            var addr
            switch (feedParams.id) {
                case 'event-bride':
                    adr = adr['xcal:x-calconnect-venue']['xcal:adr'];
                    addr = {
                        city: adr['xcal:x-calconnect-city'] ? adr['xcal:x-calconnect-city']['#'] : null,
                        country: adr['xcal:x-calconnect-country'] ? adr['xcal:x-calconnect-country']['#'] : null,
                        region: adr['xcal:x-calconnect-region'] ? adr['xcal:x-calconnect-region']['#'] : null,
                        street: adr['xcal:x-calconnect-street'] ? adr['xcal:x-calconnect-street']['#'] : null,
                        name: adr['xcal:x-calconnect-venue-name'] ? adr['xcal:x-calconnect-venue-name']['#'] : null
                    };
                    addr.removeNulls();


                    next(addr);
                    //geocode(0); todo don't need geo for the moment
                    break;
                case  'seatgeek':
                    addr = {
                        city: adr.venue.city,
                        country: adr.venue.country,
                        region: adr.venue.state,
                        street: adr.venue.address,
                        postal: adr.venue.postal_code,
                        name: adr.venue.name

                    };
//                    addr.geo = {
//                        type: "Point",
//                        coordinates: [adr.venue.location.lon, adr.venue.location.adr]
//                    };   todo don't need geo for the moment
                    next(addr);
                    break;
            }

            var extra = {
                formatter: null
            };
            var geocoderProvider = ['datasciencetoolkit', 'openstreetmap', 'google'];
            var httpAdapter = 'http';

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

        },


        setCategory: function (feedArticle) {
            if (feedArticle.categories !== undefined)return feedArticle.categories;
            if (feedArticle.type !== undefined)return [feedArticle.type];
            return [];
        },

        setUrl: function (feedArticle) {
            if (feedArticle["xcal:url"] !== undefined)return feedArticle["xcal:url"]['#'];
            if (feedArticle.url !== undefined) return feedArticle.url;
            return null;
        },

        setStartDate: function (feedArticle) {
            if (feedArticle["xcal:dtstart"] !== undefined) return feedArticle["xcal:dtstart"][1]['#'];
            if (feedArticle.datetime_local !== undefined) return feedArticle.datetime_local;
            return null;
        },

        setEndDate: function (feedArticle) {
            if (feedArticle["xcal:dtend"] !== undefined) return feedArticle["xcal:dtend"][1]['#'];
            return null;
        },

        setOrganizer: function (feedArticle) {
            if (feedArticle["xcal:x-calconnect-organizer"] !== undefined) return feedArticle["xcal:x-calconnect-organizer"]["xcal:x-calconnect-organizer-name"]['#'];

        }
    };


    return function (feedParams, feedArticle, next) {
        //addr is a callback based and not the rest because migth need geolocation
        setters.setPlace(feedParams, feedArticle, function (addr) {

            var article = {
                title: feedArticle.title,
                categories: setters.setCategory(feedArticle),
                url: setters.setUrl(feedArticle),
                place: addr,
                startDate: setters.setStartDate(feedArticle),
                endDate: setters.setEndDate(feedArticle),
                description: feedArticle.description,
                organizer: setters.setOrganizer(feedArticle)
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