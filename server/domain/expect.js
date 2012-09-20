'use strict';

var util = require('util');

var typeError = function(type, required) {
	return util.format('Property "%s" must be of type %s%s', '%s', type, required ? '' : ', or empty');
};

var typeValidators = module.exports = {},
	empty = typeValidators.empty = {
		error: 'Property "%s" must not be set',
		func: 
			function(value) {
				return value === undefined || value === null;
			}
	},

	string = typeValidators.string = {
		error: typeError('string', true),
		func: 
			function(value) {
				return typeof value === 'string';
			}
	},

	stringOrEmpty = typeValidators.stringOrEmpty = {
		error: typeError('string'),
		func: 
			function(value) {
				return string.func(value) || empty.func(value);
			}
	},

	number = typeValidators.number =  {
		error: typeError('number', true),
		func: 
			function(value) {
				return typeof value === 'number';
			}
	},

	numberOrEmpty = typeValidators.numberOrEmpty = {
		error: typeError('number'),
		func: 
			function(value) {
				return number.func(value) || empty.func(value);
			}
	},

	boolean = typeValidators.boolean = {
		error: typeError('boolean', true),
		func: 
			function(value) {
				return typeof value === 'boolean';
			}
	},

	booleanOrEmpty = typeValidators.booleanOrEmpty = {
		error: typeError('boolean'),
		func: 
			function(value) {
				return bool.func(value) || empty.func(value);
			}
	},

	object = typeValidators.object = {
		error: typeError('object', true),
		func: 
			function(value) {
				return typeof value === 'object' && value != null;
			}
	},

	objectOrEmpty = typeValidators.objectOrEmpty = {
		error: typeError('object'),
		func: 
			function(value) {
				return object.func(value) || empty.func(value);
			}
	},

	document = typeValidators.document = {
		error: typeError('document', true),
		func: 
			function(value) {
				return typeof value === 'object' && value != null;
			}
	},

	documentOrEmpty = typeValidators.documentOrEmpty = {
		error: typeError('document'),
		func: 
			function(value) {
				return document.func(value) || empty.func(value);
			}
	};
