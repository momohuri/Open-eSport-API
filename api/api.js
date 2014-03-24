define([], function () {


        return{

            find: function (req, res) {
                var params = req.query;
                if (params.distance == undefined) params.distance = 150000;
                if (params.page == undefined) params.page = 0;
                var numberPerPage = 30;
                var skip = params.page * numberPerPage;

                var query = {};

                if (params.categories != undefined) {
                    if (typeof params.categories === "string") {
                        query.categories = {$in: categories[params.categories]};
                    } else {
                        query.categories = {$in: []};
                        params.categories.forEach(function (category) {
                            query.categories.$in = query.categories.$in.concat(categories[category]);
                        });
                    }
                }
                if (params.minPrice != undefined) {
                    query['maxPrice'] = {$gte: Number(params.minPrice)}
                }
                if (params.maxPrice != undefined) {
                    query['minPrice'] = {$lte: Number(params.maxPrice)}
                }
                if (params.start == undefined) {
                    res.send({error: "provide a start Date"})
                } else if (params.endDate == undefined) {
                    var start = new Date(params.start.replace('"', '').replace('"', '')).setHours(0, 0, 0, 0);
                    var end = new Date(params.start.replace('"', '').replace('"', '')).setHours(23, 59, 59, 999);
                } else {
                    start = new Date(params.start.replace('"', '').replace('"', '')).setHours(0, 0, 0, 0);
                    end = new Date(params.endDate.replace('"', '').replace('"', '')).setHours(23, 59, 59, 999);
                }
                query['start'] = {"$gt": new Date(start), "$lt": new Date(end)};


                if (params.latitude != undefined && params.longitude) {
                    query['place.geo'] = { $near: {$geometry: {coordinates: [Number(params.longitude), Number(params.latitude)], type: 'Point'}, $maxDistance: params.distance }};
                }

                db.collection('articles').find(query).limit(numberPerPage).skip(skip).sort('start').toArray(function (err, docs) {
                    if (err)throw err;
                    docs.forEach(function (doc) {
                        doc.category = setCategory(doc);
                    });
                    res.send(docs);
                });

                function setCategory(doc) {
                    if (typeof params.categories === 'object') {  //if we have a category we just take from it
                        for (var y = 0; y < params.categories.length; y++) {
                            for (var i = 0; i < doc.categories.length; i++) {
                                if (categories[params.categories[y]].indexOf(doc.categories[i]) !== -1) {
                                    return params.categories[y];
                                }
                            }
                        }
                    } else if (typeof params.categories === 'string') {
                            for (var i = 0; i < doc.categories.length; i++) {
                                if (categories[params.categories].indexOf(doc.categories[i]) !== -1 ) {
                                    return params.categories;
                                }
                            }
                    } else {
                        for (var key in categories) {
                            for (var i = 0; i < doc.categories.length; i++) {
                                if (categories[key].indexOf(doc.categories[i]) !== -1) {
                                    return key;
                                }
                            }
                        }
                    }
                }


                //full text search if needed

//                db.executeDbCommand({text: 'articles', search: params.search, filter: {"place.city": {$in: cities}}}, function (err, result) {  //order by cities
//                    res.send(result.documents[0].results.map(function (item) {
//                        return item.obj
//                    }));
//                });

            },

            categories: function (req, res) {

                var map = function () {
                    if (!this.categories) {
                        return;
                    }

                    for (index in this.categories) {
                        emit(this.categories[index], 1);
                    }
                };
                var reduce = function (previous, current) {
                    var count = 0;

                    for (index in current) {
                        count += current[index];
                    }

                    return count;
                };

                db.collection('articles').mapReduce(map, reduce, {out: { inline: 1 }},
                    function (err, docs) {
                        docs.sort(function (a, b) {
                            return b.value - a.value;
                        });
                        res.send(docs)
                    });
            },

            city: function (req, res) {
                var map = function () {
                    if (!this.place) {
                        return;
                    }
                    for (index in this.place) {
                        emit(this.place[index], 1);
                    }
                };
                var reduce = function (previous, current) {
                    var count = 0;
                    for (index in current) {
                        count += current[index];
                    }

                    return count;
                };

                db.collection('articles').mapReduce(map, reduce, {out: { inline: 1 }},
                    function (err, docs) {
                        docs.sort(function (a, b) {
                            return b.value - a.value;
                        });
                        res.send(docs)
                    });


            }
        }
    }
)
;
