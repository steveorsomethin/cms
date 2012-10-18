'use strict';

var errors = require('../errors'),
	jsv = require('jsv'),
	env = jsv.JSV.createEnvironment(),
	documentTypeSchema = env.getDefaultSchema();

var model = module.exports = {},
	validators = model.validators = {};

validators.DocumentType = function(documentType) {
	//TODO: Create a better way of self-validating document types
	if (!documentType.properties || !documentType.type) {
		return new errors.InvalidInput('DocumentType validation failed', 
			{
				'type': 'Property is required',
				'properties': 'Property is required'
			});
	}

	var validResult = env.validate(documentType, documentTypeSchema);

	if (validResult.errors.length) {
		return new errors.InvalidInput('DocumentType validation failed', validResult.errors);
	}
};

validators.Document = function(document, documentType) {
	var validResult = env.validate(document, documentType);

	if (validResult.errors.length) {
		return new errors.InvalidInput('Document validation failed', validResult.errors);
	}
};

var enforceTypes = function(obj, definition) {
	var key, property, error;
	for (key in definition) {
		if (definition.hasOwnProperty(key)) {
			property = definition[key];
			obj[key] = property.type(obj[key] || property.defaultValue);
		}
	}

	return error;
};

//Functions for enforcing serialization of primitive types on json payloads
model.String = String;
model.Number = Number;

//Javascript's default Boolean('false') returns true. Thus, the following
model.Boolean = function(value) {

	return !(!Boolean(value) || (typeof value === 'string' && value.toLowerCase() === 'false'));
};

model.DocumentProperty = function(obj) {
	return enforceTypes(obj, {
		type: {type: model.String, defaultValue: 'string'},
		required: {type: model.Boolean, defaultValue: false}
	});
};

model.DocumentType = function(obj) {
	var key, error;
	for (key in obj) {
		if (obj.hasOwnProperty(key)) {
			error = model.DocumentProperty(obj[key]);
		}
	}

	return obj;
};