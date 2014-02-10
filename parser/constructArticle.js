define(['node-geocoder'], function (geocoder) {

    var model = {

        setPlace: function (article, next) {
            var addr;
            switch (this.id) {
                case 'event-brite':
                    var adr = article['xcal:x-calconnect-venue']['xcal:adr'];
                    addr = {
                        city: adr['xcal:x-calconnect-city'] ? adr['xcal:x-calconnect-city']['#'] : null,
                        country: adr['xcal:x-calconnect-country'] ? adr['xcal:x-calconnect-country']['#'] : null,
                        region: adr['xcal:x-calconnect-region'] ? adr['xcal:x-calconnect-region']['#'] : null,
                        street: adr['xcal:x-calconnect-street'] ? adr['xcal:x-calconnect-street']['#'] : null,
                        name: adr['xcal:x-calconnect-venue-name'] ? adr['xcal:x-calconnect-venue-name']['#'] : null
                    };
                    addr.removeNulls();
                    geocode(0);

                    // next(addr);

                    break;
                case  'stubhub':
                    addr = {
                        city: article.ancestorGeoDescriptions[3],
                        country: article.ancestorGeoDescriptions[1],
                        region: article.ancestorGeoDescriptions[2],
                        street: article.addr1,
                        postal: article.zip,
                        name: article.eventGeoDescription

                    };
                    addr.geo = {
                        type: "Point",
                        coordinates: [article.longitude, article.latitude]
                    };
                    next(addr);
                    break;

            }
            var extra = {
                formatter: null
            };


            function geocode(i) {
                var geocoderProvider = ['datasciencetoolkit', 'openstreetmap', 'google'];
                var httpAdapter = 'http';
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

        setCategory: function (feedArticle, id) {
            if (id === undefined) id = this.id;
            if (id === 'stubhub') {
                return feedArticle.ancestorGenreDescriptions;
            } else if (id === 'event-brite') {
                return feedArticle.categories;
            }
            return [];
        },

        setUrl: function (feedArticle, id) {
            if (id === undefined) id = this.id;
            if (id === 'stubhub') {
                return  'http://stubhub.com/' + feedArticle.genreUrlPath + '/' + feedArticle.urlpath;
            } else if (id === 'event-brite') {
                return feedArticle["xcal:url"]['#'];
            }
            return null;
        },

        setStartDate: function (feedArticle, id) {
            if (id === undefined) id = this.id;
            if (id === 'stubhub') {
                return new Date(feedArticle.event_date);
            } else if (id === 'event-brite') {
                return new Date(feedArticle["xcal:dtstart"][1]['#']);
            }
            return [];
        },

        setEndDate: function (feedArticle, id) {
            if (id === undefined) id = this.id;
            if (id === 'event-brite' && feedArticle["xcal:dtend"] !== undefined) {
                return new Date(feedArticle["xcal:dtend"][1]['#']);
            }
            return null;
        },

        setOrganizer: function (feedArticle, id) {
            if (id === undefined) id = this.id;
            if (id === 'event-brite' && feedArticle["xcal:x-calconnect-organizer"] !== undefined) {
                return feedArticle["xcal:x-calconnect-organizer"]["xcal:x-calconnect-organizer-name"]['#'];
            }
            return null;
        },

        setMinPrice: function (feedArticle, id) {
            if (id === undefined) id = this.id;
            if (id === 'stubhub') {
                return feedArticle["minPrice"];
            }
            return null;
        },
        setMaxPrice: function (feedArticle, id) {
            if (id === undefined) id = this.id;
            if (id === 'stubhub') {
                return feedArticle["maxPrice"];
            }
            return null;
        },

        setTitle: function (feedArticle, id) {
            if (id === undefined) id = this.id;
            if (id === 'stubhub') {
                return feedArticle.description;
            }
        },

        setDesc: function(feedArticle,id){
            if (id === undefined) id = this.id;
            if (id === 'stubhub') {
                return feedArticle.title;
            }
        },

        setId:function(feedArticle,id){
            if (id === undefined) id = this.id;
            if (id === 'stubhub') {
                return feedArticle.event_id;
            }
        },

        setAll: function (feedArticle, feedParams, next) {

            this.id = feedParams.id;
            model.setPlace(feedArticle, function (addr) {
                var article = {
                    title: model.setTitle(feedArticle),
                    categories: model.setCategory(feedArticle),
                    url: model.setUrl(feedArticle),
                    place: addr,
                    startDate: model.setStartDate(feedArticle),
                    endDate: model.setEndDate(feedArticle),
                    description: model.setDesc(feedArticle),
                    organizer: model.setOrganizer(feedArticle),
                    minPrice: model.setMinPrice(feedArticle),
                    maxPrice: model.setMaxPrice(feedArticle),
                    eventId:model.setId(feedArticle)
                };
                article.removeNulls();
                next(article);
            });
        },

        getLastId: function (website, next) {
            db.collection('articles2').findOne({website: website}, {sort: {$natural: -1}}, function (err, doc) {
                next(doc)
            });
        }
    };


    return model;
})
;


//I don't want to insert null fields in mongo
Object.prototype.removeNulls = function () {
    var obj = this;
    var isArray = obj instanceof Array;
    for (var k in obj) {
        if (obj[k] === null || obj[k] === undefined) isArray ? obj.splice(k, 1) : delete obj[k];
        else if (typeof obj[k] == "object") obj[k].removeNulls();
    }
};