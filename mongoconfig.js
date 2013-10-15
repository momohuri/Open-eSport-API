var mongo = require('mongodb');
 
var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;
 
var server = new Server('ds045938.mongolab.com', 45938, {journal: false, fsync: false, w: 1, auto_reconnect: true});
db = new Db('openesport', server);
 
db.open(function(err, client) {
	client.authenticate('openesport', 'oepwd13', function(err, success) {
	    if(!err) {
	        console.log("Connected to 'openesport' database");
	    }
	});
});

exports.db = db;


// var mongo = require('mongodb');
 
// var Server = mongo.Server,
//     Db = mongo.Db,
//     BSON = mongo.BSONPure;
 
// var server = new Server('bcj5rjbogbt0g2k8.mongo.clvrcld.net', 27017, {auto_reconnect: true});
// db = new Db('bcj5rjbogbt0g2k8', server);
 
// db.open(function(err, client) {
// 	client.authenticate('uer54jv7ti46gfj8', '1e033c93a03c4b9f94447eb7122a88ea', function(err, success) {
// 	    if(!err) {
// 	        console.log("Connected to 'openesport' database");
// 	    }
// 	});
// });

// exports.db = db;


// var mongo = require('mongodb');
 
// var Server = mongo.Server,
//     Db = mongo.Db,
//     BSON = mongo.BSONPure;
 
// var server = new Server('localhost', 27017, {auto_reconnect: true});
// db = new Db('openesport', server);
 
// db.open(function(err, client) {
//     if(!err) {
//         console.log("Connected to 'openesport' database");
//     }
// });

// exports.db = db;

