//Modules
var requirejs 		= require('requirejs');
var express 		= require('express');

requirejs.config({
    nodeRequire: require
});

requirejs(['api', 'express', 'mongoconfig', 'routes'], function(api, express, mongo, routes){
	// var db 				= mongo.db;
	var app 			= express();

	var port = process.env.PORT || 5000;
	var mongodb = mongo.init();
	

	app.listen(port, function() {
	  console.log("Listening on " + port);
	});

	routes.init(app);
});