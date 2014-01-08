define(['mongodb'], function(mongo){
	return {
		init: function(callback){
			var Server = mongo.Server,
			    Db = mongo.Db,
			    BSON = mongo.BSONPure;
			 
			var server = new Server('localhost', 27017);
			db = new Db('openesport', server, {w: 0, safe: true, strict: false});
			 
			db.open(function(err, client) {
			    if(!err) {
			        console.log("Connected to 'openesport' database");
			        callback();
			    }
			});
		}
	}
});
