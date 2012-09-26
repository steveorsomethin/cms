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

//DocumentTypes
var DocumentTypeManager = domainManagers.DocumentTypeManager = function() {

};

DocumentTypeManager.prototype.create = function(documentTypeName, documentType, onComplete) {
	return documentTypeRepo.create(documentTypeName, documentType, onComplete);
};

DocumentTypeManager.prototype.read = function(documentTypeName, onComplete) {
	documentTypeRepo.read(documentTypeName, function(error, result) {
		if (error) {
			return onComplete(error);
		} else if (!result) {
			error = new errors.ResourceNotFound(util.format('DocumentType with name %s not found.', documentTypeName));
			return onComplete(error);
		} else {
			return onComplete(null, result);
		}
	});
};

DocumentTypeManager.prototype.update = function(documentTypeName, documentType, onComplete) {
	documentTypeRepo.update(documentTypeName, documentType, onComplete);
};

DocumentTypeManager.prototype.delete = function(documentTypeName, onComplete) {
	documentTypeRepo.delete(documentTypeName, onComplete);
};

//Documents
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
DocumentManager.prototype.create = function(documentTypeName, documentName, document, onComplete) {
	async.waterfall([
		function(callback) {
			documentTypeRepo.read(documentTypeName, callback);
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

DocumentManager.prototype.read = function(documentTypeName, documentName, onComplete) {
	documentRepo.read(documentName, onComplete);
};

DocumentManager.prototype.update = function(documentTypeName, documentName, document, onComplete) {
	documentRepo.update(documentName, document, onComplete);
};

DocumentManager.prototype.delete = function(documentTypeName, documentName, onComplete) {
	documentRepo.delete(documentName, onComplete);
};