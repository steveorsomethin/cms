'use strict';

var redis = require('redis'),
	express = require('express');

var application = module.exports = {};

var initializeEndpoints = function(port) {
	var app = express.createServer();

	app.get("/datatypes/:id", function(req, res) {

	});

	app.listen(port);
};

application.run = function() {
	initializeEndpoints(8080);
};