//Modules
var requirejs 		= require('requirejs');
var express 		= require('express');

requirejs.config({
    nodeRequire: require
});

requirejs(['../api/init', '../parser/init', './mongo_config', ], function(api, parser, mongo){
	
	mongo.init(function(){
		parser.init();
		api.init();
	});

	process.on('uncaughtException', function (err) {
	    console.error(err);
	    console.log("keeping node alive");
	});

});