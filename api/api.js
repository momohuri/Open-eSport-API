define([], function () {


    return{

        find: function (req, res) {
            var params = req.query;
            if (params.distance == undefined)params.distance = 15000;
            if (params.categories === undefined) params.categories = ['.*'];

            if (params.city) {
                dbCities.collection('cities').findOne({city: capitalizeFirstLetter(params.city), country: 'US'}, function (err, doc) {
                    if (err) throw err;
                    dbCities.collection('cities').distinct('city', {
                        "geo": { $nearSphere: {$geometry: {coordinates: [doc.longitude, doc.latitude], type: 'Point'}, $maxDistance: params.distance } }
                    }, function (err, cities) {
                        db.collection('articles').find({"place.city": {$in: cities}, 'categories': {$in: params.categories}}).toArray(function (err, docs) {
                            res.send(docs);
                        })

                    });
                });
            } else {
                db.collection('articles').find({}).limit(100).toArray(function (err, docs) {
                    res.send(docs);
                })
            }


            //todo full text search if needed

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
        }
    }
});
