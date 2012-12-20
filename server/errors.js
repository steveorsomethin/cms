'use strict';

var util = require('util');

var errors = module.exports = {};

var ErrorBase = function(message, constructor) {
	Error.captureStackTrace(this, constructor || this);
	this.message = message || 'Error';
};
util.inherits(ErrorBase, Error);

var defineError = function(name, definition) {
	var key,
		defaultConstructor = function(message) {
			this.constructor.super_.call(this, message, this.constructor);
		},
		errorType = definition && definition.constructor ? definition.constructor : defaultConstructor;

	util.inherits(errorType, ErrorBase);

	errorType.type = name;
	errorType.prototype.type = name;

	for (key in definition) {
		if (definition.hasOwnProperty(key) && key !== 'constructor') {
			errorType.prototype[key] = definition[key];
		}
	}

	errors[name] = errorType;
};

defineError('ResourceNotFound');
defineError('ResourceExists');

/* 
* The 'details' argument here should come in the form of a map
* where each key is the name of an invalid property, and the value
* is a description about why it is invalid.
*/
defineError('InvalidInput', {
	constructor: function(message, details) {
		this.constructor.super_.call(this, message, this.constructor);
		this.details = details;
	}
});