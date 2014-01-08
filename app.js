//Modules
var requirejs 		= require('requirejs');
var express 		= require('express');

requirejs.config({
    nodeRequire: require
});

requirejs(['api', 'express', 'mongoconfig', 'routes'], function(api, express, mongo, routes){
	// var db 				= mongo.db;
	var app 			= express();
	
	var port = 5000;
	var mongodb = mongo.init();
	

	//app config
	var allowCrossDomain = function(req, res, next) {
	    res.header('Access-Control-Allow-Origin', '*');
	    res.header('Access-Control-Allow-Methods', 'GET');
	    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

	    // intercept OPTIONS method
	    if ('OPTIONS' == req.method) {
	      res.send(200);
	    }
	    else {
	      next();
	    }
	};

	app.configure(function () {
		app.use(allowCrossDomain);
	});

	app.listen(port, function() {
	  console.log("Listening on " + port);
	});

	routes.init(app);
});