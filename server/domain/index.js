//TODO: Break this out as needed, or simply collapse up a level into domain.js

'use strict';

var util = require('util'),
	async = require('async'),
	expect = require('./expect'),
	persistence = require('../persistence'),
	redisPersistence = require('../persistence/redis');

var documentTypeRepo = new persistence.DocumentTypeRepo(redisPersistence.documentTypes),
	documentRepo = new persistence.DocumentRepo(redisPersistence.documents),
	templateRepo = new persistence.TemplateRepo(redisPersistence.templates);

var domainManagers = module.exports = {};

var DocumentManager = domainManagers.DocumentManager = function() {
	//Whatever here
};

var validateDocument = function(document, documentType) {
	var errors = {}, key, prop, validator, valid;

	for (key in documentType) {
		prop = documentType[key];
		validator = expect[prop.type + (prop.required ? '' : 'OrEmpty')];
		valid = validator.func(document[key]);
		console.log([validator, document[key], valid, prop.required]);
		if (!valid) {
			errors[key] = util.format(validator.error, key);
		}
	}

	return Object.keys(errors).length ? errors : null;
};

//TODO: Pass documentType to persistence module
DocumentManager.prototype.create = function(documentType, documentName, document, onComplete) {
	var errors = validateDocument(document);

	if (!documentType) {
		return callback('Missing required field "documentType"');
	}

	async.waterfall([
		function(callback) {
			documentTypeRepo.read(documentType, callback);
		},

		function(documentType, callback) {
			var errors = validateDocument(document, documentType);
			if (!errors) {
				return documentRepo.create(documentName, document, function(error, result) {
					callback(error, document);
				});
			} else {
				callback(errors);
			}
		}
	], onComplete);
};

DocumentManager.prototype.read = function(documentType, documentName, onComplete) {
	documentRepo.read(documentName, onComplete);
};

DocumentManager.prototype.update = function(documentType, documentName, document, onComplete) {
	documentRepo.update(documentName, document, onComplete);
};

DocumentManager.prototype.delete = function(documentType, documentName, onComplete) {
	documentRepo.delete(documentName, onComplete);
};