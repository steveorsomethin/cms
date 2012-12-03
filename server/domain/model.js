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

	return null;
};

validators.Document = function(document, documentType) {
	var validResult = env.validate(document, documentType);

	if (validResult.errors.length) {
		return new errors.InvalidInput('Document validation failed', validResult.errors);
	}

	return null;
};

var templateSchema = {
	"id": "template",
	"name": "template",
	"type": "object",
	"additionalProperties" : false,
	"properties": {
		"id": {"type": "string", "required": true},
		"name": {"type": "string", "required": true},
		"documentType": {"type": "string", "required": true},
		"isArray": {"type": "boolean", "required": false},
		"body": {"type": "string", "required": true}
	}
}

validators.Template = function(template) {
	var validResult = env.validate(template, templateSchema);

	if (validResult.errors.length) {
		return new errors.InvalidInput('Template validation failed', validResult.errors);
	}

	return null;
}
