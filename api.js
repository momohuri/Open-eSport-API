var mongoConfig		= require('./mongoconfig');
var db 				= mongoConfig.db;
	
exports.findByLanguage = function(req, res) {
	db.collection('articles').find({language: req.params.lang}).toArray(function(err, articles){
		if(!err) res.send(articles);
	});
};

exports.findByWebsite = function(req, res) {
	db.collection('articles').find({website: req.params.website}).toArray(function(err, articles){
		if(!err) res.send(articles);
	});
};

exports.findByGame = function(req, res) {
	db.collection('articles').find({categories: req.params.game}).toArray(function(err, articles){
		if(!err) res.send(articles);
	});
};

exports.findByWebsiteAndGame = function(req, res) {
	db.collection('articles').find({website: req.params.website, categories: req.params.game}).toArray(function(err, articles){
		if(!err) res.send(articles);
	});
};