'use strict';

var httpResources = require('./resources/http');

var application = module.exports = {};

application.run = function(port) {
	return httpResources.initialize(port || 8088);
};
