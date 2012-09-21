'use strict';

var util = require('util');

var errors = module.exports = {};

var ErrorBase = function (message, constructor) {
  Error.captureStackTrace(this, constructor || this);
  this.message = message || 'Error';
};
util.inherits(ErrorBase, Error);

var defineError = function(name, definition) {
	var errorType = definition && definition.constructor ? definition.constructor :
		function (message) {
		  this.constructor.super_.call(this, message, this.constructor);
		};

	util.inherits(errorType, ErrorBase);

	errorType.prototype.name = name;

	for (var key in definition) {
		if (key != 'constructor')
			errorType.prototype[key] = definition[key];
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
defineError('InvalidInput', 
	{
		constructor: function (message, details) {
		  this.constructor.super_.call(this, message, this.constructor);
		  this.details = details;
		},
		toString: function() {
			var string = 'Error: ' + this.message;
			if (this.details && Object.keys(this.details).length) {
				string += '\nDetails:'
				for (var key in this.details) {
					string += util.format('\n    %s: %s', key, this.details[key]);
				}
				string += '\n';
			}
			
			return string;
		}
	}
);