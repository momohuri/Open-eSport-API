define([], function () {


        return{

            find: function (req, res) {
                var params = req.query;
                if (params.distance == undefined) params.distance = 15000;
                if (params.page == undefined) params.page = 0;
                var numberPerPage = 30;
                var skip = params.page * numberPerPage;

                var query = {};

                if (params.categories != undefined) query.categories = params.categories;
                if (params.minPrice != undefined) {
                    query['maxPrice'] = {$gte: Number(params.minPrice)}
                }
                if (params.maxPrice != undefined) {
                    query['minPrice'] = {$lte: Number(params.maxPrice)}
                }
                if (params.startDate == undefined) {
                    res.send({error: "provide a start Date"})
                } else if (params.endDate == undefined) {
                    var start = new Date(params.startDate).setHours(0, 0, 0,0) ;
                    var end = new Date(params.startDate).setHours(23, 59, 59, 999);
                }else{
                    end = new Date(params.endDate).setHours(23,59,59,999);
                }
                query['startDate'] = {"$gt": new Date(start),"$lt":new Date(end)};


                if (params.latitude != undefined && params.longitude) {
                    query['place.geo'] = { $near: {$geometry: {coordinates: [Number(params.longitude), Number(params.latitude)], type: 'Point'}, $maxDistance: params.distance }};
                }


                db.collection('articles').find(query).limit(numberPerPage).skip(skip).toArray(function (err, docs) {
                    if(err)throw err;
                    res.send(docs);
                });


                //full text search if needed

//                db.executeDbCommand({text: 'articles', search: params.search, filter: {"place.city": {$in: cities}}}, function (err, result) {  //order by cities
//                    res.send(result.documents[0].results.map(function (item) {
//                        return item.obj
//                    }));
//                });

                function capitalizeFirstLetter(str) {
                    return str.replace(/\w\S*/g, function (txt) {
                        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                    });
                }
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
