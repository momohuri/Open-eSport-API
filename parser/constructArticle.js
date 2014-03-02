define(['node-geocoder'], function (geocoder) {

    var model = {

        setPlace: function (article, next) {
            var addr;
            switch (this.id) {
                case 'eventbrite':
                    if (article.venue == undefined) {
                        next(false);
                        return
                    } //if no adress ==goodbye
                    addr = {
                        city: article.venue.city,
                        country: article.venue.country,
                        region: article.venue.region,
                        street: article.venue.address,
                        name: article.venue.name
                    };
                    addr.geo = {
                        type: "Point",
                        coordinates: [article.venue.longitude, article.venue.latitude]
                    };
                    next(addr);

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
            } else if (id === 'eventbrite') {
                return feedArticle.category.split(',');
            }
            return [];
        },

        setUrl: function (feedArticle, id) {
            if (id === undefined) id = this.id;
            if (id === 'stubhub') {
                return  'http://stubhub.com/' + feedArticle.genreUrlPath + '/' + feedArticle.urlpath + '/';
            } else if (id === 'eventbrite') {
                return feedArticle.url;
            }
            return null;
        },

        setStartDate: function (feedArticle, id) {
            if (id === undefined) id = this.id;
            if (id === 'stubhub') {
                return new Date(feedArticle.event_date);
            } else if (id === 'eventbrite') {
                return new Date(feedArticle.start_date);
            }
            return null;
        },

        setEndDate: function (feedArticle, id) {
            if (id === undefined) id = this.id;
            if (id === 'eventbrite') {
                return new Date(feedArticle.end_date);
            }
            return null;
        },

        setOrganizer: function (feedArticle, id) {
            if (id === undefined) id = this.id;
            if (id === 'eventbrite') {
                if (feedArticle.organizer == undefined) return null;
                return feedArticle.organizer.name;
            }
            return null;
        },

        setPrice: function (feedArticle, id) {
            if (id === undefined) id = this.id;
            var price = {};
            if (id === 'stubhub') {
                price.max = feedArticle["maxPrice"];
                price.min = feedArticle["minPrice"];
                price.currency = feedArticle.currency_code;
                return price;
            } else if (id === 'eventbrite') {
                price.max = feedArticle.tickets[0].ticket.max;
                price.min = feedArticle.tickets[0].ticket.min;
                price.currency = feedArticle.tickets[0].ticket.currency;
                return price;
            }
            return null;
        },

        setTitle: function (feedArticle, id) {
            if (id === undefined) id = this.id;
            if (id === 'stubhub') {
                return feedArticle.description;
            } else if (id == 'eventbrite') {
                return feedArticle.title;
            }
            return null;
        },

        setDesc: function (feedArticle, id) {
            if (id === undefined) id = this.id;
            if (id === 'stubhub') {
                return feedArticle.title;
            } else if (id === 'eventbrite') {
                return feedArticle.description;
            }
            return null;
        },

        setId: function (feedArticle, id) {
            if (id === undefined) id = this.id;
            if (id === 'stubhub') {
                return feedArticle.event_id;
            } else if (id === 'eventbrite') {
                return feedArticle.id
            }
        },

        setImage: function (feedArticle, id) {
            if (id === undefined) id = this.id;
            if (id === 'stubhub') {
                //return  'http://stubhub.com/data/venue_maps/' + feedArticle.geography_parent + '/' + feedArticle.image_url;
                return null;
            } else if (id === 'eventbrite') {
                return feedArticle.logo;
            }
        },

        setAll: function (feedArticle, feedParams, next) {
            this.id = feedParams.id;
            model.setPlace(feedArticle, function (addr) {
                if (!addr)next(false);//if not address
                var article = {
                    title: model.setTitle(feedArticle),
                    categories: model.setCategory(feedArticle),
                    url: model.setUrl(feedArticle),
                    place: addr,
                    startDate: model.setStartDate(feedArticle),
                    endDate: model.setEndDate(feedArticle),
                    description: model.setDesc(feedArticle),
                    organizer: model.setOrganizer(feedArticle),
                    price: model.setPrice(feedArticle),
                    eventId: model.setId(feedArticle),
                    imageUrl: model.setImage(feedArticle)
                };
                removeNulls(article);
                next(article);
            });
        }
    };

    return model;
})
;


//I don't want to insert null fields in mongo
var removeNulls = function (object) {
    var obj = object;
    var isArray = obj instanceof Array;
    for (var k in obj) {
        if (obj[k] === null || obj[k] === undefined) isArray ? obj.splice(k, 1) : delete obj[k];
        else if (typeof obj[k] == "object") removeNulls(obj[k]);
    }
};