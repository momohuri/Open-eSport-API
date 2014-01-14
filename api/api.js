define([], function () {


    return{

        find: function (req, res) {
            var params = req.query;
            db.collection('cities').findOne({city: capitalizeFirstLetter(params.city), country: 'US'}, function (err, doc) {
                if (err) throw err;
                var r = db.collection('articles').find({
                    "place.geo": { $near: {$geometry: {coordinates: [doc.longitude, doc.latitude], type: 'Point'}, $maxDistance: 15000 } }
                })
               debugger

            });


            function capitalizeFirstLetter(str)
            {
                return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
            }
        }
    }
});
