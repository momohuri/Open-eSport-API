define([], function () {


    return{

        find: function (req, res) {
            var params = req.query;
            var distance = params.distance == undefined ? 15000 : params.distance;


            //query the city around and then do the full search text with $in city
            dbCities.collection('cities').findOne({city: capitalizeFirstLetter(params.city), country: 'US'}, function (err, doc) {
                if (err) throw err;
                dbCities.collection('cities').distinct('city', {
                    "geo": { $nearSphere: {$geometry: {coordinates: [doc.longitude, doc.latitude], type: 'Point'}, $maxDistance: distance } }
                }, function (err, cities) {
                    if (params.search) {
                        db.executeDbCommand({text: 'articles', search: params.search, filter: {"place.city": {$in: cities}}}, function (err, result) {  //order by cities
                            res.send(result.documents[0].results.map(function (item) {
                                return item.obj
                            }));
                        });
                    } else {
                        db.collection('articles').find({"place.city": {$in: cities}}).toArray(function (err, docs) {
                            res.send(docs);
                        })
                    }
                });
            });

            function capitalizeFirstLetter(str) {
                return str.replace(/\w\S*/g, function (txt) {
                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                });
            }
        }
    }
});
