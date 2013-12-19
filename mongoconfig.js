var mongo = require('mongodb');
 
define(['mongodb', 'feeds_cron'], function(mongo, feeds_cron){
	return {
		
		init: function(){

			// var Server = mongo.Server,
			//     Db = mongo.Db,
			//     BSON = mongo.BSONPure;
			 
			// var server = new Server('ds045938.mongolab.com', 45938, {journal: false, fsync: false, w: 1, auto_reconnect: true});
			// db = new Db('openesport', server);
			 
			// db.open(function(err, client) {
			// 	client.authenticate('openesport', 'oepwd13', function(err, success) {
			// 	    if(!err) {
			// 	        console.log("Connected to 'openesport' database");
			// 	        feeds_cron.init();
			//         	feeds_cron.launchFeeds();
			// 	    }
			// 	});
			// });

			var Server = mongo.Server,
			    Db = mongo.Db,
			    BSON = mongo.BSONPure;
			 
			var server = new Server('ds061518.mongolab.com', 45938, {journal: false, fsync: false, w: 1, auto_reconnect: true});
			db = new Db('openesportprod', server);
			 
			db.open(function(err, client) {
				client.authenticate('nodejitsu_aereivir', '3ldc0h9f7h3uf52bi2mqe0tafj', function(err, success) {
				    if(!err) {
				        console.log("Connected to 'openesport' database");
				        feeds_cron.init();
			        	feeds_cron.launchFeeds();
				    }
				});
			});

			// var Server = mongo.Server,
			//     Db = mongo.Db,
			//     BSON = mongo.BSONPure;
			 
			// var server = new Server('localhost', 27017);
			// db = new Db('openesport', server, {w: 0, safe: true, strict: false});
			 
			// db.open(function(err, client) {
			//     if(!err) {
			//         console.log("Connected to 'openesport' database");
			//         feeds_cron.init();
			//         feeds_cron.launchFeeds();
			//     }
			// });
		}
	}
});
