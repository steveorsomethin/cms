//TODO: Break this out as needed, or simply collapse up a level into domain.js

'use strict';

var util = require('util'),
	async = require('async'),
	uuid = require('node-uuid'),
	errors = require('../errors'),
	model = require('./model'),
	validators = model.validators,
	persistence = require('../persistence'),
	redisPersistence = require('../persistence/redis'),
	mongoosePersistence = require('../persistence/mongoose');

var documentTypeNotFound = 'DocumentType with name %s not found.',
	documentNotFound = 'Document with name %s not found.';

var documentTypeRepo = new persistence.DocumentTypeRepo(mongoosePersistence.documentTypes),
	documentRepo = new persistence.DocumentRepo(mongoosePersistence.documents),
	templateRepo = new persistence.TemplateRepo(redisPersistence.templates);

var domainManagers = module.exports = {};

//DocumentTypes
var DocumentTypeManager = domainManagers.DocumentTypeManager = function() {

};

DocumentTypeManager.prototype.create = function(documentTypeName, documentType, onComplete) {
	var validationError = validators.DocumentType(documentType);
	documentType.id = documentType.name;
	if (validationError) {
		return onComplete(validationError);
	} else {
		return documentTypeRepo.create(documentTypeName, documentType, onComplete);
	}
};

DocumentTypeManager.prototype.read = function(documentTypeName, onComplete) {
	documentTypeRepo.read(documentTypeName, function(error, result) {
		if (error) {
			return onComplete(error);
		} else if (!result) {
			error = new errors.ResourceNotFound(util.format(documentTypeNotFound, documentTypeName));
			return onComplete(error);
		} else {
			return onComplete(null, result);
		}
	});
};

DocumentTypeManager.prototype.readAll = function(onComplete) {
	documentTypeRepo.readAll(function(error, result) {
		if (error) {
			return onComplete(error);
		} else if (!result) {
			error = new errors.ResourceNotFound(util.format(documentTypeNotFound, documentTypeName));
			return onComplete(error);
		} else {
			return onComplete(null, result);
		}
	});
};

DocumentTypeManager.prototype.update = function(documentTypeName, documentType, onComplete) {
	var validationError = validators.DocumentType(documentType);
	documentType.id = documentType.name;
	if (validationError) {
		return onComplete(validationError);
	} else {
		documentTypeRepo.update(documentTypeName, documentType, onComplete);
	}
};

DocumentTypeManager.prototype.del = function(documentTypeName, onComplete) {
	documentTypeRepo.del(documentTypeName, onComplete);
};

//Documents
var DocumentManager = domainManagers.DocumentManager = function() {
	//Whatever here
};

var preSaveDocument = function(documentTypeName, document, callback) {
	async.waterfall([
		function(callback) {
			documentTypeRepo.read(documentTypeName, function(error, documentType) {
				if (error) {
					callback(error);
				} else {
					callback(null, documentType);
				}
			});
		},

		function(documentType, callback) {
			if (!documentType) {
				var error = new errors.ResourceNotFound(util.format(documentTypeNotFound, documentTypeName));
				return callback(error);
			}

			var validationError = validators.Document(document, documentType);
			if (validationError) {
				return callback(validationError);
			} 

			return callback();
		}
	], callback);
};

//TODO: Pass documentType to persistence module
DocumentManager.prototype.create = function(documentTypeName, documentName, document, onComplete) {
	async.waterfall([
		function(callback) {
			preSaveDocument(documentTypeName, document, callback);
		},

		function(callback) {
			documentRepo.create(documentName, document, function(error, result) {
				if (error) {
					return callback(error);
				} 

				return callback(null, result);
			});
		}
	], onComplete);
};

DocumentManager.prototype.read = function(documentTypeName, documentName, onComplete) {
	documentRepo.read(documentName, function(error, result) {
		if (error) {
			return onComplete(error);
		} else if (!result) {
			error = new errors.ResourceNotFound(util.format(documentNotFound, documentName));
			return onComplete(error);
		} else {
			return onComplete(null, result);
		}
	});
};

DocumentManager.prototype.filter = function(filter, tag, onComplete) {
	documentRepo.filter(filter, tag, onComplete); //TODO: Fill this out
};

DocumentManager.prototype.update = function(documentTypeName, documentName, document, onComplete) {
	async.waterfall([
		function(callback) {
			preSaveDocument(documentTypeName, document, callback);
		},

		function(callback) {
			documentRepo.update(documentName, document, function(error, result) {
				if (error) {
					return callback(error);
				} 

				return callback(null, result);
			});
		}
	], onComplete);
};

DocumentManager.prototype.del = function(documentTypeName, documentName, onComplete) {
	documentRepo.del(documentName, onComplete);
};