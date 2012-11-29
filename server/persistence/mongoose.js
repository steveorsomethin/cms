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
	),
	Template = db.model('Templates',
		new mongoose.Schema({
			metadata: Schema.Types.Mixed,
			template: Schema.Types.Mixed
		})
	);

//Document Types
documentTypes.create = function(name, documentType, callback) {
	var record = new DocumentType({documentType: documentType});
	DocumentType.update(
		{'documentType.name': name},
		{$set: {documentType: documentType}},
		{upsert: true},
		function(error, result) {
			if (error) {
				callback(error);
			} else {
				callback(null, documentType);
			}
		}
	);
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

documentTypes.update = documentTypes.create; //TODO: Do we need this?

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
	Document.update(
		{'document.name': name},
		{$set: {document: document}},
		{upsert: true},
		function(error, result) {
			if (error) {
				callback(error);
			} else {
				callback(null, document);
			}
		}
	);
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

documents.update = documents.create; //TODO: Do we need this?

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
	Template.update(
		{'template.name': name},
		{$set: {template: template}},
		{ upsert: true },
		function(error, result) {
			if (error) {
				callback(error);
			} else {
				callback(null, template);
			}
		}
	);
};

templates.filter = function(filter, tag, callback) {
	callback('Not implemented');
};

templates.read = function(name, callback) {
	Template.findOne({'template.name': name}, function(error, result) {
		var template;

		if (error) {
			callback(error);
		} else {
			template = result ? result.template : null;
			callback(null, template);
		}
	});
};

templates.readAll = function(callback) {
	Template.find({}, function(error, results) {
		var templates = [];

		if (error) {
			callback(error);
		} else {
			for (var i = 0; i < results.length; i++) {
				templates.push(results[i].template);
			}
			callback(null, templates);
		}
	});
};

templates.update = templates.create; //TODO: Do we need this?

templates.del = function(name, callback) {
	Template.findOneAndRemove({'template.name': name}, function(error, result) {
		if (error) {
			callback(error);
		} else {
			callback();
		}
	});
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