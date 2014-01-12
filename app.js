var requirejs = require('requirejs');

requirejs.config({
    nodeRequire: require,
    baseUrl: './'
});

requirejs(['api/init', 'parser/init', 'mongodb', 'fs' ], function (api, parser, mongo, fs) {


    var conf = JSON.parse(fs.readFileSync('./conf/' + process.env.NODE_ENV + '.json', 'utf8')); //on le lit en sync car ca sera jamais bloquant
    mongo.connect(conf.mongDB, function (err, database) {
        if (err) throw err;
        db = database;
        console.log("Connected to "+db.databaseName+" database");

        ensureIndex();

        parser.init();
        api.init();

    });

    var ensureIndex = function(){
        db.collection('articles').ensureIndex("title",function(){});
        db.collection('articles').ensureIndex({ description: "text",tile:"text" } ,function(){});
    }


});