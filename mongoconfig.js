var mongo = require('mongodb');
 
define(['mongodb', 'feeds_cron'], function(mongo, feeds_cron){
	return {
		
		init: function(){

			var Server = mongo.Server,
			    Db = mongo.Db,
			    BSON = mongo.BSONPure;
			 
			var server = new Server('localhost', 27017);
			db = new Db('dbname', server, {w: 0, safe: true, strict: false});
			 
			db.open(function(err, client) {
			    if(!err) {
			        console.log("Connected to 'dbname' database");
			        feeds_cron.init();
			        feeds_cron.launchFeeds();
			    }
			});
		}
	}
});
