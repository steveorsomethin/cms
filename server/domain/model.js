'use strict';

var errors = require('../errors'),
	jsv = require('jsv'),
	env = jsv.JSV.createEnvironment(),
	documentTypeSchema = env.getDefaultSchema();

var model = module.exports = {},
	validators = model.validators = {};

validators.DocumentType = function(documentType) {
	//TODO: Create a better way of self-validating document types
	if (!documentType.name || !documentType.properties || !documentType.type) {
		return new errors.InvalidInput('DocumentType validation failed', 
			{
				name: 'Property is required',
				type: 'Property is required',
				properties: 'Property is required'
			});
	}

	var validResult = env.validate(documentType, documentTypeSchema);

	if (validResult.errors.length) {
		return new errors.InvalidInput('DocumentType validation failed', validResult.errors);
	}

	return null;
};

var getDocumentSchema = function(documentType) {
	return {
		id: 'Document',
		name: 'Document',
		type: 'object',
		additionalProperties: false,
		properties: {
			id: {type: 'string', required: true},
			name: {type: 'string', required: true},
			documentType: {type: 'string', required: true},
			tags: {type: 'array', items: {type: 'string'}},
			body: documentType
		}
	};
};

validators.Document = function(document, documentType) {
	var validResult = env.validate(document, getDocumentSchema(documentType));

	if (validResult.errors.length) {
		return new errors.InvalidInput('Document validation failed', validResult.errors);
	}

	return null;
};

var templateSchema = {
	id: 'Template',
	name: 'Template',
	type: 'object',
	additionalProperties: false,
	properties: {
		id: {type: 'string', required: true},
		name: {type: 'string', required: true},
		documentType: {type: 'string', required: false},
		isArray: {type: 'boolean', required: false},
		isLayout: {type: 'boolean', required: false},
		body: {type: 'string', required: true}
	}
};

validators.Template = function(template) {
	var validResult = env.validate(template, templateSchema);

	if (validResult.errors.length) {
		return new errors.InvalidInput('Template validation failed', validResult.errors);
	}

	if (!template.documentType && !template.isLayout) {
		return new errors.InvalidInput('Template validation failed', 
			{documentType: 'Property must be set if template is not a layout'});
	}

	return null;
};

var pageSchema = {
	id: 'Page',
	name: 'Page',
	type: 'object',
	additionalProperties: false,
	properties: {
		id: {type: 'string', required: true},
		name: {type: 'string', required: true},
		layout: {type: 'string', required: true},
		sections: {
			type: 'array',
			items: {
				type: 'object',
				properties: {
					template: {type: 'string', required: true},
					placeHolder: {type: 'string', required: true},
					filter: {
						type: 'object',
						properties: {
							predicate: {type: 'string', required: true},
							documentType: {type: 'string', required: true},
							isArray: {type: 'boolean', required: false},
							parameters: {
								type: 'object',
								additionalProperties: true,
								required: false
							}
						}
					}
				}
			}
		}
	}
};

validators.Page = function(page) {
	var validResult = env.validate(page, pageSchema);

	if (validResult.errors.length) {
		return new errors.InvalidInput('Page validation failed', validResult.errors);
	}

	return null;
};
