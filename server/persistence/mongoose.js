'use strict';

var util = require('util'),
	mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	_ = require('underscore'),
	uuid = require('node-uuid'),
	async = require('async'),
	model = require('../domain/model');

var mongoosePersistence = module.exports = {},
	documentTypes = mongoosePersistence.documentTypes = {},
	documents = mongoosePersistence.documents = {},
	templates = mongoosePersistence.templates = {},
	siteMaps = mongoosePersistence.siteMaps = {};

var db = mongoose.createConnection('mongodb://dbadmin:!Sm3llf4rts@ds041177.mongolab.com:41177/GutenbergMongoLab'),
	DocumentType = db.model('DocumentTypes',
		new mongoose.Schema({
			metadata: Schema.Types.Mixed,
			documentType: Schema.Types.Mixed
		})
	),
	Document = db.model('Documents',
		new mongoose.Schema({
			tags: [String],
			metadata: Schema.Types.Mixed,
			document: Schema.Types.Mixed
		})
	);

//Document Types
documentTypes.create = function(name, documentType, callback) {
	var record = new DocumentType({documentType: documentType});
	DocumentType.create(record, function(error, result) {
		if (error) {
			callback(error);
		} else {
			callback(null, documentType);
		}
	});
};

documentTypes.filter = function(filter, callback) {
	callback('Not implemented');
};

documentTypes.read = function(name, callback) {
	DocumentType.findOne({'documentType.id': name}, function(error, result) {
		var documentType;

		if (error) {
			callback(error);
		} else {
			documentType = result ? result.documentType : null;
			callback(null, documentType);
		}
	});
};

documentTypes.readAll = function(callback) {
	DocumentType.find({}, function(error, results) {
		var documentTypes = [];

		if (error) {
			callback(error);
		} else {
			for (var i = 0; i < results.length; i++) {
				documentTypes.push(results[i].documentType);
			}
			callback(null, documentTypes);
		}
	});
};

documentTypes.update = function(name, documentType, callback) {
	DocumentType.findOneAndUpdate({'documentType.id': name}, {documentType: documentType}, function(error, result) {
		if (error) {
			callback(error);
		} else {
			callback(null, documentType);
		}
	});
};

documentTypes.del = function(name, callback) {
	DocumentType.findOneAndRemove({'documentType.id': name}, function(error, result) {
		if (error) {
			callback(error);
		} else {
			callback();
		}
	});
};

//Documents
documents.create = function(name, document, callback) {
	var record = new Document({tags: ['Test'], document: document});
	Document.create(record, function(error, result) {
		if (error) {
			callback(error);
		} else {
			callback(null, document);
		}
	});
};

documents.filter = function(filter, tag, callback) {
	filter = filter ? filter : 'true';
	Document.$where(filter).all('tags', [tag]).exec(function(error, results) {
		var documents = [];

		if (error) {
			callback(error);
		} else {
			for (var i = 0; i < results.length; i++) {
				documents.push(results[i].document);
			}
			callback(null, documents);
		}
	});
};

documents.read = function(name, callback) {
	Document.findOne({'document.id': name}, function(error, result) {
		var document;

		if (error) {
			callback(error);
		} else {
			document = result ? result.document : null;
			callback(null, document);
		}
	});
};

documents.readAll = function(name, callback) {
	callback('Not implemented');
};

documents.update = function(name, document, callback) {
	Document.findOneAndUpdate({'document.id': name}, {document: document}, function(error, result) {
		if (error) {
			callback(error);
		} else {
			callback(null, document);
		}
	});
};

documents.del = function(name, callback) {
	Document.findOneAndRemove({'document.id': name}, function(error, result) {
		if (error) {
			callback(error);
		} else {
			callback();
		}
	});
};

//Templates
templates.create = function(name, template, callback) {
	callback('Not implemented');
};

templates.read = function(name, callback) {
	callback('Not implemented');
};

templates.readAll = function(callback) {
	callback('Not implemented');
};

templates.update = function(name, template, callback) {
	callback('Not implemented');
};

templates.del = function(name, callback) {
	callback('Not implemented');
};

//Site Maps
siteMaps.create = function(name, siteMap, callback) {
	callback('Not implemented');
};

siteMaps.read = function(name, callback) {
	callback('Not implemented');
};

siteMaps.update = function(name, siteMap, callback) {
	callback('Not implemented');
};

siteMaps.del = function(name, callback) {
	callback('Not implemented');
};