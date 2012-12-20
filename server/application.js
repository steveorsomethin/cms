'use strict';

var httpResources = require('./resources/http');

var application = module.exports = {};

application.run = function(port) {
	httpResources.initialize(port || 8088);
};
