var requirejs = require('requirejs');

requirejs.config({
    nodeRequire: require,
    baseUrl: './'
});

requirejs(['api/init', 'parser/init', 'mongodb', 'fs' ], function (api, parser, mongo, fs) {


    var conf = JSON.parse(fs.readFileSync('./conf/' + process.env.NODE_ENV + '.json', 'utf8')); //on le lit en sync car ca sera jamais bloquant
    mongo.connect(conf.mongoCities, { server: {options: { auto_reconnect: true }}}, function (err, database) {
            if (err) throw err;
            dbCities = database;
            console.log("Connected to " + dbCities.databaseName + " database");
            mongo.connect(conf.mongoEvents, { server: {options: { auto_reconnect: true }} }, function (err, database2) {
                if (err) throw err;
                db = database2;
                console.log("Connected to " + db.databaseName + " database");
                mongo.connect(conf.mongoCheckEvents, { server: {options: { auto_reconnect: true }} }, function (err, database3) {
                    if (err) throw err;
                    dbCheck = database3;
                    console.log("Connected to " + dbCheck.databaseName + " database");


                    ensureIndex();
                    parser.init();
                    api.init();
                });
            });
        }
    )
    ;


    var ensureIndex = function () {
//        db.collection('articles').ensureIndex({ description: "text", title: "text"}, {}, function (err, indexName) {
//        });
        db.collection('articles').ensureIndex({ categories: true}, {}, function (err, indexName) {
        });
        db.collection('articles').ensureIndex({ cities: true}, {}, function (err, indexName) {
        });
        db.collection('articles').ensureIndex({ url: true}, {}, function (err, indexName) {
        });
        dbCities.collection('cities').ensureIndex({ "geo": "2dsphere"}, {}, function (err, indexName) {
        });
        dbCities.collection('cities').ensureIndex({ "city": true, "country": true}, {}, function (err, indexName) {
        });
    }
})
;

process.on('uncaughtException', function (err) {
    console.log('Caught exception: ' + err);
});
