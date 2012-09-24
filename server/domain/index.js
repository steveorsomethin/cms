//TODO: Break this out as needed, or simply collapse up a level into domain.js

'use strict';

var util = require('util'),
	async = require('async'),
	errors = require('../errors'),
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
	var errorDetails = {}, key, prop, validator, valid;

	for (key in documentType) {
		if (documentType.hasOwnProperty(key)) {
			prop = documentType[key];
			validator = expect[prop.type + (prop.required ? '' : 'OrEmpty')];
			valid = validator.func(document[key]);

			if (!valid) {
				errorDetails[key] = util.format(validator.error, key);
			}
		}
	}

	return Object.keys(errorDetails).length ?
			new errors.InvalidInput('Invalid input document', errorDetails) : null;
};

//TODO: Pass documentType to persistence module
DocumentManager.prototype.create = function(documentType, documentName, document, onComplete) {
	async.waterfall([
		function(callback) {
			documentTypeRepo.read(documentType, callback);
		},

		function(documentType, callback) {
			var validError = validateDocument(document, documentType);
			if (validError) {
				return callback(validError);
			}
			return documentRepo.create(documentName, document, function(error, result) {
				callback(error, document);
			});
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