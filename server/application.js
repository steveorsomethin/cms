'use strict';

var httpResources = require('./resources/http');

var application = module.exports = {};

application.run = function(config) {
	return httpResources.initialize(config);
};
