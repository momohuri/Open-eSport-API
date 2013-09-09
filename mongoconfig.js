var mongo = require('mongodb');
 
var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;
 
var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('openesport', server);
 
db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'openesport' database");
        db.collection('articles', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'articles' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
    }
});

exports.db = db;