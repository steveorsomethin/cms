'use strict';

var httpResources = require('./resources/http');

var application = module.exports = {};

application.run = function() {
	httpResources.initialize(8080);
};